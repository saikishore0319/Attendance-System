import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import { enrollFace } from "../services/api";

function EnrollFace() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!image) {
      setMessage("Capture image first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");
      await enrollFace(image, token);

      localStorage.setItem("faceEnrolled", "true");
      setMessage("Enrollment successful ✓");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.log(err);
      setMessage(err.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Face Enrollment
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Capture a clear image to complete identity setup.
        </p>

        {/* Webcam Container */}
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <WebcamCapture
            onCapture={(img) => {
              setImage(img);
              setMessage("");
            }}
          />

          {image && (
            <>
              {/* Success Badge */}
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                Captured ✓
              </div>

              {/* Border Glow */}
              <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl pointer-events-none"></div>
            </>
          )}
        </div>

        {/* Thumbnail Preview */}
        {image && (
          <div className="mt-4 flex justify-center">
            <img
              src={image}
              alt="Captured preview"
              className="w-24 h-24 object-cover rounded-xl border border-white/20 shadow-md"
            />
          </div>
        )}

        {/* Enroll Button */}
        <button
          onClick={handleEnroll}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-300
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-green-500 hover:scale-[1.02] hover:shadow-lg"
            }`}
        >
          {loading ? "Enrolling..." : "Enroll Face"}
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-5 text-center text-sm font-medium">
            <span
              className={`${
                message.includes("successful")
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollFace;