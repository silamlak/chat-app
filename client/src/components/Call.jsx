import React, { useEffect, useRef, useState } from "react";
import { IoCall, IoCallSharp } from "react-icons/io5";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import Peer from "simple-peer";
import socket from "../utils/socketConection";
import { useSelector } from "react-redux";

const Call = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const myId = useSelector((state) => state.auth.userId);
  const chatFriend = useSelector((state) => state.chat.chatFriend);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("callUser", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: chatFriend?._id,
        signalData: data,
        from: myId,
      });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {stream && (
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-40 h-40 border"
          />
        )}
        {callAccepted && !callEnded ? (
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-40 h-40 border"
          />
        ) : null}
      </div>
      <div className="flex gap-4 mt-4">
        {!callAccepted ? (
          <button
            onClick={callUser}
            className="bg-blue-500 text-white p-2 rounded"
          >
            <IoVideocam /> Call
          </button>
        ) : (
          <button
            onClick={leaveCall}
            className="bg-red-500 text-white p-2 rounded"
          >
            <IoCallSharp /> Hang Up
          </button>
        )}
      </div>
      {receivingCall && !callAccepted ? (
        <div className="mt-4">
          <p>Incoming call...</p>
          <button
            onClick={answerCall}
            className="bg-green-500 text-white p-2 rounded"
          >
            <IoCall /> Answer
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Call;
