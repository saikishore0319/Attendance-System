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
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="animate-pulse text-lg tracking-wide">
          Loading dashboard...
        </div>
      </div>
    );

  if (!summary)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-400">
        No attendance data
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 tracking-tight">
          Attendance Overview
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Today Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
              Today
            </h3>
            <p className="text-4xl font-semibold text-emerald-400">
              {summary.today}
            </p>
          </div>

          {/* Weekly Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
              Last 7 Days
            </h3>
            <div className="flex justify-between text-lg">
              <span className="text-emerald-400">
                Present: {summary.weeklyPresent}
              </span>
              <span className="text-rose-400">
                Absent: {summary.weeklyAbsent}
              </span>
            </div>
          </div>

          {/* Percentage Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
              Attendance %
            </h3>
            <p className="text-4xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {summary.percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;