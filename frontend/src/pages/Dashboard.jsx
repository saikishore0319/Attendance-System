import { useEffect, useState } from "react";
import { getSummary } from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Mock data
    setSummary({
      today: "Present",
      weeklyPresent: 4,
      weeklyAbsent: 1,
      percentage: 80,
    });
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Today</h3>
          <p className="text-xl text-green-600">{summary.today}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Weekly</h3>
          <p>Present: {summary.weeklyPresent}</p>
          <p>Absent: {summary.weeklyAbsent}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Attendance %</h3>
          <p className="text-xl text-blue-600">
            {summary.percentage}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;