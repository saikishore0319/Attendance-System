import { useEffect, useState } from "react";
import { getSummary } from "../services/api";
import { getToken } from "../services/auth";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    
    getSummary(token)
      .then((data) => {
        setSummary(data);
        console.log(data);
        
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  if (!summary) return <div>No attendance data</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Today</h3>
          <p className="text-xl text-green-600">{summary.today}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">Last 7 Days</h3>
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