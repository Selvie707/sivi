import React from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import logoutIcon from "../../assets/logout.png";
import adminIcon from "../../assets/admin.png";
import learnIcon from "../../assets/learn.png";
import detectIcon from "../../assets/detect.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Logika perubahan ikon dan navigasi
  const isLearnPage = location.pathname === "/learn";
  const learnButtonIcon = isLearnPage ? detectIcon : learnIcon;
  const learnButtonTarget = isLearnPage ? "/" : "/learn";

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="navbar-icons">
        {userRole === "Admin" && (
          <img 
            src={adminIcon} 
            alt="Admin" 
            className="icon" 
            onClick={() => navigate("/updatePayment")}
            style={{ cursor: "pointer" }} 
          />
        )}
        <img 
          src={learnButtonIcon}  // Gunakan ikon sesuai halaman
          alt="Learn" 
          className="icon" 
          onClick={() => navigate(learnButtonTarget)}  // Pindah ke halaman yang sesuai
          style={{ cursor: "pointer" }} 
        />
        <img 
          src={logoutIcon} 
          alt="Logout" 
          className="icon" 
          onClick={handleLogout} 
          style={{ cursor: "pointer" }} 
        />
      </div>
    </div>
  );
};

export default Navbar;