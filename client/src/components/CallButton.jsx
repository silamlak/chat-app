import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import socket from "../utils/socketConection";
import { useSelector } from "react-redux";

// const socket = io("http://localhost:5000"); // Adjust the backend URL

const CallButton = () => {
  const [stream, setStream] = useState(null);
  const conversation = useSelector((state) => state.chat.selectedConversation);
  const myId = useSelector((state) => state.auth.userId);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Listen for incoming calls
    socket.on("callUser", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    // Clean up on unmount
    return () => {
      socket.off("callUser");
    };
  }, []);

  const callUser = () => {
    // Get user media when the "Call" button is clicked
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const peerConnection = new RTCPeerConnection();
        currentStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, currentStream);
        });

        // Handle ICE Candidate exchange
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("sendIceCandidate", {
              to: conversation.friend._id,
              candidate: event.candidate,
              from: myId
            });
          }
        };

        // Create an offer
        peerConnection
          .createOffer()
          .then((offer) => {
            return peerConnection.setLocalDescription(offer);
          })
          .then(() => {
            socket.emit("callUser", {
              userToCall: conversation?.friend?._id,
              signalData: peerConnection.localDescription,
              from: myId,
            });
          });

        // Handle incoming video stream
        peerConnection.ontrack = (event) => {
          userVideo.current.srcObject = event.streams[0];
        };

        // Save reference to the peer connection for later use
        connectionRef.current = peerConnection;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peerConnection = new RTCPeerConnection();

    // Add tracks to the connection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    // Handle ICE Candidate exchange
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", {
          to: caller,
          candidate: event.candidate,
        });
      }
    };

    // Set the remote description (the offer)
    peerConnection
      .setRemoteDescription(callerSignal)
      .then(() => {
        return peerConnection.createAnswer();
      })
      .then((answer) => {
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("answerCall", {
          signal: peerConnection.localDescription,
          to: caller,
        });
      });

    // Handle incoming video stream
    peerConnection.ontrack = (event) => {
      userVideo.current.srcObject = event.streams[0];
    };

    connectionRef.current = peerConnection;
  };

  return (
    <div>
      <div className="flex">
        {stream && <video ref={myVideo} autoPlay className="w-40 h-40" />}
        {callAccepted && (
          <video ref={userVideo} autoPlay className="w-40 h-40" />
        )}
      </div>
      {!callAccepted && !receivingCall && (
        <button
          onClick={callUser}
          className="bg-green-500 text-white px-4 py-2 mt-2"
        >
          Call
        </button>
      )}
      {receivingCall && !callAccepted && (
        <div>
          <p>Incoming call...</p>
          <button
            onClick={answerCall}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default CallButton;
