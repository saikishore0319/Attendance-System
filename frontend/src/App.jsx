import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import EnrollFace from "./pages/EnrollFace";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import { cognitoConfig } from "./services/cognitoConfig";
import { isAuthenticated, login } from "./services/auth";
import { getProfile } from "./services/api";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Cognito redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setLoading(true);

      fetch(`${cognitoConfig.domain}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: cognitoConfig.clientId,
          code,
          redirect_uri: cognitoConfig.redirectUri,
        }),
      })
        .then(async (res) => {
          const text = await res.text();
          if (!res.ok) throw new Error(text);
          return JSON.parse(text);
        })
        .then((data) => {
          if (data.id_token) {
            login(data.id_token);
            setAuthenticated(true);
          }
        })
        .catch((err) => {
          console.error("Auth error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // After authentication → check profile
  useEffect(() => {
    if (!authenticated) return;

    setCheckingProfile(true);

    const token = localStorage.getItem("token");

    getProfile(token)
      .then(() => {
        // user exists → go to dashboard
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        // if profile not found → enroll
        if (err.message.includes("User not enrolled")) {
          navigate("/enroll", { replace: true });
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setCheckingProfile(false);
      });

  }, [authenticated]);

  if (loading || checkingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Root */}
        <Route
          path="/"
          element={
            authenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/enroll"
          element={
            authenticated ? <EnrollFace /> : <Navigate to="/" />
          }
        />

        <Route
          path="/dashboard"
          element={
            authenticated ? <Dashboard /> : <Navigate to="/" />
          }
        />

        <Route
          path="/attendance"
          element={
            authenticated ? <Attendance /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

export default App;