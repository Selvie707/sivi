import React from "react";
import "./Guide.css"; // Buat file CSS terpisah untuk styling
import guideImage from "../assets/alfabet_sibi.png"; // Sesuaikan path gambar

const Guide = ({ onClose }) => {
  return (
    <div className="guide-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <img src={guideImage} alt="Panduan" className="guide-image" />
    </div>
  );
};

export default Guide;