import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import { enrollFace } from "../services/api";

function EnrollFace() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!image) {
      alert("Capture image first");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await enrollFace(image, token);

      alert("Enrollment successful");
      localStorage.setItem("faceEnrolled", "true");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Enrolling..." : "Enroll"}
        </button>
      </div>
    </div>
  );
}

export default EnrollFace;