import { useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { markAttendance } from "../services/api";
import { getToken } from "../services/auth";

function Attendance() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!image) {
      alert("Capture image first");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      const response = await markAttendance(image, token);

      setMessage(response.message);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">
          Mark Attendance
        </h2>

        <WebcamCapture onCapture={setImage} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Processing..." : "Submit Attendance"}
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Attendance;