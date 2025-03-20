import React from "react";

export const SpinnerLoader = () => (
  <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
  <svg className="w-16 h-16 animate-spin" viewBox="25 25 50 50">
    <circle
      className="stroke-current text-blue-500"
      cx="50"
      cy="50"
      r="20"
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="125"
      strokeDashoffset="0"
    ></circle>
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
