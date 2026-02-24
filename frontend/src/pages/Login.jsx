import { cognitoConfig } from "../services/cognitoConfig";

function Login() {
  const handleLogin = () => {
    const loginUrl =
      `${cognitoConfig.domain}/login` +
      `?response_type=code` +
      `&client_id=${cognitoConfig.clientId}` +
      `&redirect_uri=${encodeURIComponent(cognitoConfig.redirectUri)}` +
      `&scope=openid+email+profile`;

    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login with Cognito
        </button>
      </div>
    </div>
  );
}

export default Login;