import React, { useRef } from "react";
import Webcam from "react-webcam";

function WebcamCapture({ onCapture }) {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-xl"
        width={320}
      />
      <button
        onClick={capture}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        Capture
      </button>
    </div>
  );
}

export default WebcamCapture;