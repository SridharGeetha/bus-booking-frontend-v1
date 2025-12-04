import React from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, logout } from "../Service/service";
import "/src/css/navbar.css";
import { toast, ToastContainer } from "react-toastify";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";


export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const username = localStorage.getItem("username") || "USER";

  const getInitial = (username) => {
    const data = username.split(" ");
    return data.length > 1
      ? (data[0].charAt(0) + data[1].charAt(0)).toUpperCase()
      : data[0].charAt(0).toUpperCase();
  };

  const initials = getInitial(username);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    toast.error("Logout Successful", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigate("/");
  };

  const handleDashBoard = () => {
    navigate("/admin");
    setIsMenuOpen(false);
  };
  const handleBrandClick = () => {
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="custom-navbar ">
      <div className="nav-container">
        <div className="nav-brand" onClick={handleBrandClick}>
          <div className="brand-text">
            <span className="brand-main">BusBook</span>
            <span className="brand-sub">Online Booking</span>
          </div>
        </div>

        <div className="nav-content">
          {isAuthenticated() ? (
            <>
              <div className="user-info-desktop">
                <div className="user-avatar">
                  <span className="avatar-text">{initials}</span>
                </div>
                <div className="user-details">
                  <span className="username">Welcome, {username}</span>
                </div>
              </div>
              <div className="nav-actions">
                {isAdmin() && (
                  <button
                    className="nav-btn nav-btn-primary"
                    onClick={handleDashBoard}
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  className="nav-btn nav-btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
              <div className={`mobile-menu-btn ${isMenuOpen ? "active" : ""}`}>
                {isAuthenticated() ? (
                  <div className="flex flex-row md:flex-row items-center gap-3">
                    {isAdmin() && (
                      <button
                        onClick={handleDashBoard}
                        className="w-full md:w-auto flex items-center justify-center gap-2 
                   px-2 py-2 text-white font-semibold rounded-md
                   bg-[linear-gradient(135deg,#ff6b6b,#ee5a24)]
                   shadow-[0_4px_15px_rgba(255,107,107,0.3)]
                   hover:opacity-90 transition"
                      >
                        <DashboardIcon fontSize="small" />
                        
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full md:w-auto flex items-center justify-center gap-2
                 px-2 py-2 text-white font-semibold rounded-md
                 bg-[linear-gradient(135deg,#ff6b6b,#ee5a24)]
                 shadow-[0_4px_15px_rgba(255,107,107,0.3)]
                 hover:opacity-90 transition"
                    >
                      <LogoutIcon fontSize="small" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full md:w-auto flex items-center justify-center gap-2
               px-5 py-2 text-white font-semibold rounded-md
               bg-[linear-gradient(135deg,#ff6b6b,#ee5a24)]
               shadow-[0_4px_15px_rgba(255,107,107,0.3)]
               hover:opacity-90 transition"
                  >
                    <LoginIcon fontSize="small" />
                    Sign In
                  </button>
                )}
              </div>

              <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    <span className="avatar-text">{initials}</span>
                  </div>
                  <div className="user-details">
                    <span className="username">{username}</span>
                    {isAdmin() && <span className="admin-badge">Admin</span>}
                  </div>
                </div>

                <div className="mobile-nav-actions">
                  {isAdmin() && (
                    <button
                      className="mobile-nav-btn"
                      onClick={handleDashBoard}
                    >
                      <span className="btn-icon">📊</span>
                      Dashboard
                    </button>
                  )}
                  <button
                    className="mobile-nav-btn logout-btn"
                    onClick={handleLogout}
                  >
                    <span className="btn-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Sign In
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </nav>
  );
};
