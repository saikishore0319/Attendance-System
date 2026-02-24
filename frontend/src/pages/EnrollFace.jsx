import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";

function EnrollFace() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleEnroll = () => {
    if (!image) return;
    localStorage.setItem("faceEnrolled", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">
          Complete Face Enrollment
        </h2>

        <WebcamCapture onCapture={setImage} />

        <button
          onClick={handleEnroll}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded"
        >
          Enroll
        </button>
      </div>
    </div>
  );
}

export default EnrollFace;