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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center">

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Secure sign-in to access your attendance dashboard.
        </p>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl font-semibold transition-all duration-300 
                     bg-gradient-to-r from-blue-500 to-cyan-500 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          Login with Cognito
        </button>

        <div className="mt-6 text-xs text-gray-500">
          Powered by secure identity authentication
        </div>

      </div>
    </div>
  );
}

export default Login;