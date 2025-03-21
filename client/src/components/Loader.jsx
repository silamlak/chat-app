import React from "react";

export const SpinnerLoader = () => (
  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
);

export const DotsLoader = () => (
  <div className="flex justify-center space-x-1">
    <div className="w-3 h-3 bg-green-500 rounded-full animate-[bounce_1.5s_infinite_0s]"></div>
    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-[bounce_1.5s_infinite_0.2s]"></div>
    <div className="w-3 h-3 bg-red-500 rounded-full animate-[bounce_1.5s_infinite_0.4s]"></div>
    {/* <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1.5s_infinite_0.6s]"></div>
    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1.5s_infinite_0.8s]"></div> */}
  </div>
);

export const CircularLoader = () => (
  <svg className="w-6 h-6 animate-spin" viewBox="0 0 100 100">
    <circle
      className="stroke-current text-blue-500"
      cx="50"
      cy="50"
      r="40"
      fill="none"
      strokeWidth="12"
      strokeLinecap="round"
      strokeDasharray="90"
      strokeDashoffset="80"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0; 80"
        // dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);


export const BarsLoader = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-8 bg-blue-500 animate-pulse"></div>
    <div className="w-2 h-6 bg-blue-500 animate-pulse delay-150"></div>
    <div className="w-2 h-10 bg-blue-500 animate-pulse delay-300"></div>
    <div className="w-2 h-6 bg-blue-500 animate-pulse delay-450"></div>
    <div className="w-2 h-8 bg-blue-500 animate-pulse delay-600"></div>
  </div>
);
