import { useState } from "react";
import WebcamCapture from "../components/WebcamCapture";

function Attendance() {
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!image) return;
    alert("Attendance Submitted (Mock)");
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
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default Attendance;