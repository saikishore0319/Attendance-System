import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import EnrollFace from "./pages/EnrollFace";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import { cognitoConfig } from "./services/cognitoConfig";
import { isAuthenticated, isFaceEnrolled, login } from "./services/auth";
import { useNavigate } from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [enrolled, setEnrolled] = useState(isFaceEnrolled());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    // console.log("hrl");

    if (code) {
      setLoading(true);
      // console.log("hello");

      console.log(code);


      fetch(`${cognitoConfig.domain}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: cognitoConfig.clientId,
          code: code,
          redirect_uri: cognitoConfig.redirectUri,
        }),
      })
        .then(async (res) => {
          const text = await res.text();
          console.log("Status:", res.status);
          console.log("Response:", text);

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
      // navigate("/dashboard", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authenticated]);

  if (loading) return <div>Authenticating...</div>;

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            authenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* Not authenticated */}
        {!authenticated && (
          <>
            <Route path="/dashboard" element={<Navigate to="/" />} />
            <Route path="/attendance" element={<Navigate to="/" />} />
            <Route path="/enroll" element={<Navigate to="/" />} />
          </>
        )}

        {/* Authenticated but not enrolled */}
        {authenticated && !enrolled && (
          <>
            <Route path="/dashboard" element={<Navigate to="/enroll" />} />
            <Route path="/attendance" element={<Navigate to="/enroll" />} />
          </>
        )}

        {/* Protected */}
        <Route path="/enroll" element={<EnrollFace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </>
  );
}

export default App;