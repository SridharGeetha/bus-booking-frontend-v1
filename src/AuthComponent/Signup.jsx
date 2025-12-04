import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../Service/service";
import { Info } from "@mui/icons-material";
import { useLoading } from "../Context/LoadingProvider";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const { loading, setLoading } = useLoading();

  const [userData, setaUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!userData.username.trim()) errors.username = "Username is required";
    if (!userData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      errors.email = "Invalid email format";
    if (!userData.password.trim()) errors.password = "Password is required";
    else if (userData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleChange = (e) => {
    setaUserData({ ...userData, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setLoading(true);
    try {
      const response = await register(userData);
      console.log(response.data);
      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-t from-blue-700 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Create Your Account
        </h2>

        {error.general && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2">
            <div className="w-5 h-5" />
            <span>{error.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={userData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error.username ? "border-red-500" : "border-white"
              }`}
            />
            {error.username && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <Info className="w-4 h-4" />
                {error.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error.username ? "border-red-500" : "border-white"
              }`}
            />
            {error.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <Info className="w-4 h-4" />
                {error.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error.username ? "border-red-500" : "border-white"
              }`}
            />
            {error.password && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <Info className="w-4 h-4" />
                {error.password}
              </p>
            )}
          </div>

          {loading ? (
            <span className="loader1"></span>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-500 shadow-md shadow-blue-500/50 cursor-pointer hover:bg-blue-600 text-white font-semibold py-3.5 rounded-lg transition duration-200 shadow-lg shadow-cyan-500/50"
            >
              Sign Up
            </button>
          )}
          <p className="text-center text-sm text-white mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-cyan-300 hover:underline font-medium"
            >
              Login
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

export default Signup;
