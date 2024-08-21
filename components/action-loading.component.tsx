"use client";
import React, { useEffect, useState } from "react";

function ActionLoading({ text }: { text: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + 1, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="w-full min-h-[320px] flex flex-col items-center justify-center gap-4 bg-gray-50 rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <span className="text-lg font-medium text-gray-700">{text}</span>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ActionLoading;
