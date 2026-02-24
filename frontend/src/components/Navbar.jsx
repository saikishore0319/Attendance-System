import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";

function Navbar() {
  const authenticated = isAuthenticated();

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between">
      <h1 className="font-bold text-lg">Attendance System</h1>

      {authenticated && (
        <div className="space-x-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/attendance">Attendance</Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;