import { useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { getSummary } from "../services/api";
import { getToken } from "../services/auth";
import { BASE_URL } from "../services/api";

function Attendance() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!image) {
      setMessage("Capture image first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = getToken();
      const summary = await getSummary(token);

      if (summary.today === "PRESENT") {
        setMessage("Attendance already captured today");
        return;
      }

      const res = await fetch(`${BASE_URL}/upload-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { uploadUrl } = await res.json();

      const base64Data = image.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: "image/jpeg",
      });

      await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
      });

      setMessage("Image uploaded. Processing attendance...");
    } catch (err) {
      console.log(err);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Mark Attendance
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Capture your image to record today’s presence.
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
              {/* Captured Badge */}
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-300
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.02] hover:shadow-lg"
            }`}
        >
          {loading ? "Processing..." : "Submit Attendance"}
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-5 text-center text-sm font-medium">
            <span
              className={`${
                message.includes("failed")
                  ? "text-rose-400"
                  : message.includes("already")
                  ? "text-yellow-400"
                  : "text-emerald-400"
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

export default Attendance;