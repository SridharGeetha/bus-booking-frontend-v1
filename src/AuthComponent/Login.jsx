import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isUser, login } from "../Service/service";
import { useLoading } from "../Context/LoadingProvider";
import { Info } from "@mui/icons-material";
import { AlertTitle } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const { loading, setLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);
    if (!email || !password) return;
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.statusCode === 500) {
        setError("Invalid email or password.");
      }
      
      if (userData.token) {
        localStorage.setItem("token", userData.token);
        sessionStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("id", userData.userId);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("email", userData.email);
      }
      if (userData.role == "ADMIN") {
        navigate("/admin");
      } else if (isUser()) {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-t from-blue-700 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-transparent rounded-xl  shadow-xl/30 border border-indigo-900 p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTitle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error.username ? "border-red-500" : "border-white"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-orange-700 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Email is required.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error.username ? "border-red-500" : "border-white"
              }`}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-orange-700 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Password is required.
              </p>
            )}
          </div>
          {loading ? (
            <span className="loader1"></span>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-500 shadow-md shadow-blue-500/50 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition duration-200"
            >
              Login
            </button>
          )}

          <p className="text-center text-sm text-white mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSignup}
              className="text-cyan-300 hover:underline font-medium cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;
