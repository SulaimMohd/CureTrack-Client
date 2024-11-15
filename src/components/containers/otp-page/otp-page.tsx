"use client";

import React, { useState, useRef, useEffect } from "react";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const focusNext = (index: number) => {
    const nextInput = inputsRef.current[index + 1];
    if (nextInput && nextInput !== document.activeElement) {
      nextInput.focus();
    }
  };

  const focusPrev = (index: number) => {
    const prevInput = inputsRef.current[index - 1];
    if (prevInput && prevInput !== document.activeElement) {
      prevInput.focus();
    }
  };

  const handleChange = (value: string, index: number) => {
    value = value.replace(/\s/g, "").slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      focusNext(index);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("text").replace(/\s/g, "");
    const firstEmptyIndex = otp.findIndex((digit) => digit === "");

    if (firstEmptyIndex !== -1 && pasteData.length <= otp.length) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[firstEmptyIndex + i] = pasteData[i];
      }
      setOtp(newOtp);
      inputsRef.current[firstEmptyIndex + pasteData.length - 1]?.focus();
    }
    event.preventDefault();
  };

  const handleInputFocus = (index: number) => {
    if (otp[index] !== "" && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0 && otp[index] === "") {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        focusPrev(index);
      }
    }
    if (event.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = () => {
    if (otp.every((digit) => digit !== "")) {
      setOtp(Array(6).fill(""));
    }
  };

  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((digit) => digit === "");
    if (firstEmptyIndex !== -1) {
      inputsRef.current[firstEmptyIndex]?.focus();
    }
  }, [otp]);

  return (
    <div>
      <div className="flex justify-center space-x-2 mb-6">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            type="text"
            maxLength={1}
            autoComplete="one-time-code"
            className="w-10 h-10 text-center text-lg font-semibold text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-green-500 sm:w-12 sm:h-12 sm:text-2xl md:w-14 md:h-14"
            value={otp[index]}
            onChange={(e) => handleChange(e.target.value, index)}
            onPaste={handlePaste}
            onFocus={() => handleInputFocus(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={index > 0 && otp[index - 1] === ""}
          />
        ))}
      </div>
      <button
        className="w-full py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        disabled={otp.some((digit) => digit === "")}
        onClick={handleClick}
      >
        Verify
      </button>
    </div>
  );
};

export default OtpPage;
