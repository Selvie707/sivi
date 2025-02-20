import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css"; // Buat file CSS terpisah untuk styling

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="guide-container">
        <button className="close-button" onClick={() => navigate("/")}>✖</button>
        <h2>YOU ARE UNAUTHORIZED</h2>
    </div>
  );
};

export default Unauthorized;