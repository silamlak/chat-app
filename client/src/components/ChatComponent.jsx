import React, { useState, useEffect, useRef } from "react";
import socket from "../utils/socketConection";
import { useSelector } from "react-redux";
import { FaPhone, FaPhoneSlash, FaTimes } from "react-icons/fa";

const ChatComponent = () => {
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const myId = useSelector((state) => state.auth.userId);
  const [callStatus, setCallStatus] = useState("idle");
  const [peerId, setPeerId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const iceCandidateBuffer = useRef([]);
  const [isProcessingCall, setIsProcessingCall] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const remoteStreamRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceTransportPolicy: "all", // Ensure TURN is used if needed
  };

  const setupWebRTC = () => {
    if (peerConnection.current) {
      console.log("Closing existing peer connection");
      peerConnection.current.close();
    }
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && peerId) {
        console.log("Sending ICE candidate to:", peerId, event.candidate);
        socket.emit("ice-candidate", {
          to: peerId,
          candidate: event.candidate,
        });
      } else if (!event.candidate) {
        console.log("ICE gathering complete");
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log(
        "ontrack event fired with stream:",
        event.streams[0],
        "tracks:",
        event.streams[0].getTracks()
      );
      if (!remoteVideoRef.current) return;

      const stream = event.streams[0];
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = stream;
        console.log(
          "Initial remote stream set with tracks:",
          stream.getTracks()
        );
      } else {
        event.track && remoteStreamRef.current.addTrack(event.track);
        console.log(
          "Added track to existing stream, tracks now:",
          remoteStreamRef.current.getTracks()
        );
      }

      if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        remoteVideoRef.current.muted = false;
        console.log("Assigned remote stream to video element");
        remoteVideoRef.current
          .play()
          .then(() => console.log("Remote stream playing successfully"))
          .catch((e) => console.error("Error playing remote stream:", e));
      }
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      const state = peerConnection.current.iceConnectionState;
      console.log("ICE connection state:", state);
      if (state === "failed") {
        console.error("ICE connection failed, restarting ICE...");
        peerConnection.current.restartIce();
      }
    };

    peerConnection.current.onicegatheringstatechange = () => {
      console.log(
        "ICE gathering state:",
        peerConnection.current.iceGatheringState
      );
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.current.connectionState);
    };

    peerConnection.current.onsignalingstatechange = () => {
      console.log("Signaling state:", peerConnection.current.signalingState);
    };
  };

  const getComputerMedia = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );

      console.log("Available video devices:", videoDevices);
      console.log("Available audio devices:", audioDevices);

      const videoDevice = videoDevices[0];
      const audioDevice = audioDevices[0];

      console.log("Selected video device:", videoDevice);
      console.log("Selected audio device:", audioDevice);

      if (!videoDevice || !audioDevice) {
        throw new Error("No suitable computer camera or microphone found");
      }

      const constraints = {
        video: { deviceId: { exact: videoDevice.deviceId } },
        audio: { deviceId: { exact: audioDevice.deviceId } },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Local stream tracks:", stream.getTracks());
      return stream;
    } catch (error) {
      console.error("Error getting computer media:", error);
      throw error;
    }
  };

  useEffect(() => {
    socket.on("call-request", async ({ from, offer }) => {
      if (!offer || !offer.type || isProcessingCall) {
        console.error("Invalid offer or call in progress:", offer);
        socket.emit("call-rejected", { to: from });
        return;
      }

      if (window.confirm(`${from} is calling you. Accept?`)) {
        setIsProcessingCall(true);
        setupWebRTC();

        try {
          const stream = await getComputerMedia();
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
          }

          console.log("Setting remote offer SDP:", offer.sdp);
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          iceCandidateBuffer.current.forEach((candidate) => {
            peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          });
          iceCandidateBuffer.current = [];

          stream.getTracks().forEach((track) => {
            console.log("Adding track to peer connection:", track);
            peerConnection.current.addTrack(track, stream);
          });

          console.log("Creating answer...");
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          console.log("Local answer set SDP:", answer.sdp);

          if (!hasAnswered) {
            socket.emit("call-accepted", {
              to: from,
              from: myId,
              answer,
            });
            setHasAnswered(true);
          }

          setCallStatus("in-call");
          setPeerId(from);
        } catch (error) {
          console.error("Error accepting call:", error);
          socket.emit("call-rejected", { to: from });
          cleanupCall();
        } finally {
          setIsProcessingCall(false);
        }
      } else {
        socket.emit("call-rejected", { to: from });
      }
    });

    socket.on("call-accepted", async ({ from, answer }) => {
      if (
        !answer ||
        !answer.type ||
        isProcessingCall ||
        !peerConnection.current ||
        hasAnswered
      ) {
        console.error("Invalid answer or call state:", {
          answer,
          isProcessingCall,
          hasAnswered,
        });
        return;
      }

      const currentState = peerConnection.current.signalingState;
      if (currentState !== "have-local-offer") {
        console.error(`Cannot set answer in state: ${currentState}`);
        cleanupCall();
        return;
      }

      setIsProcessingCall(true);
      try {
        console.log("Setting remote answer SDP:", answer.sdp);
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        iceCandidateBuffer.current.forEach((candidate) => {
          peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        });
        iceCandidateBuffer.current = [];

        setCallStatus("in-call");
        setPeerId(from);
        setHasAnswered(true);
      } catch (error) {
        console.error("Error setting answer:", error);
        cleanupCall();
      } finally {
        setIsProcessingCall(false);
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (!candidate || !peerConnection.current) return;
        if (peerConnection.current.remoteDescription) {
          console.log("Adding received ICE candidate:", candidate);
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          console.log("Buffering ICE candidate:", candidate);
          iceCandidateBuffer.current.push(candidate);
        }
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    });

    socket.on("call-rejected", () => {
      console.log("Call rejected");
      setCallStatus("idle");
      cleanupCall();
    });

    socket.on("call-ended", () => {
      console.log("Call ended");
      setCallStatus("idle");
      cleanupCall();
    });

    return () => {
      socket.off("call-request");
      socket.off("call-accepted");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [myId]);

  const startCall = async () => {
    if (isProcessingCall) {
      console.error("Call already in progress");
      return;
    }

    try {
      if (!localVideoRef.current) {
        console.error("Local video element not ready");
        return;
      }

      setIsProcessingCall(true);
      setupWebRTC();

      const stream = await getComputerMedia();
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      stream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track);
        peerConnection.current.addTrack(track, stream);
      });

      console.log("Creating offer...");
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      console.log("Local offer set SDP:", offer.sdp);

      setCallStatus("calling");
      socket.emit("call-request", {
        from: myId,
        to: conversation.friend._id,
        offer,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("idle");
      cleanupCall();
      alert("Failed to start call: " + error.message);
    } finally {
      setIsProcessingCall(false);
    }
  };

  const cancelCall = () => {
    setCallStatus("idle");
    socket.emit("call-cancelled", { to: peerId, from: myId });
    cleanupCall();
  };

  const endCall = () => {
    setCallStatus("idle");
    socket.emit("call-ended", { to: peerId, from: myId });
    cleanupCall();
  };

  const cleanupCall = () => {
    if (peerConnection.current) {
      console.log(
        "Cleaning up peer connection, current state:",
        peerConnection.current.signalingState
      );
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setPeerId(null);
    iceCandidateBuffer.current = [];
    setIsProcessingCall(false);
    setHasAnswered(false);
    remoteStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Video Chat
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: callStatus !== "idle" ? "flex" : "none",
            flexDirection: "row",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ position: "relative" }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "300px",
                height: "225px",
                borderRadius: "8px",
                objectFit: "cover",
                background: "#000",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                color: "#fff",
                background: "rgba(0,0,0,0.6)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              You
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "300px",
                height: "225px",
                borderRadius: "8px",
                objectFit: "cover",
                background: "#000",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                color: "#fff",
                background: "rgba(0,0,0,0.6)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {peerId || "Remote"}
            </span>
            {callStatus === "in-call" && (
              <button
                onClick={endCall}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#cc0000")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#ff4d4d")
                }
              >
                <FaPhoneSlash size={20} />
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          {callStatus === "idle" && (
            <button
              onClick={startCall}
              style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#45a049")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#4CAF50")}
            >
              <FaPhone size={18} />
              Start Call
            </button>
          )}
          {callStatus === "calling" && (
            <button
              onClick={cancelCall}
              style={{
                background: "#ff9800",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#e68a00")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#ff9800")}
            >
              <FaTimes size={18} />
              Cancel Call
            </button>
          )}
          {callStatus === "in-call" && (
            <p style={{ color: "#666", margin: "10px 0" }}>
              In call with: {peerId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
