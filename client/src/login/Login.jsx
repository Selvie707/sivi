import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Buat file CSS terpisah untuk styling
import registerImage from "../assets/logo.png"; // Sesuaikan path gambar

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const logInUser = () => {
    if (email.length === 0) {
      alert("Email blank!");
    } else if (password.length === 0) {
      alert("Password blank!");
    } else {
      axios.post("http://127.0.0.1:5000/login", {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        
        // Simpan status login di localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.role);
  
        navigate("/");
      })
      .catch(function (error) {
        console.log(error, "error");
        if (error.response && error.response.status === 401) {
          alert("Invalid Credentials");
        } else if (error.response && error.response.status === 402) {
          alert("Kamu belum bayar");
        }
      });
    }
  };  

  return (
    <div className="registerContainer">
      {/* Left Side */}
      <div className="logoContainer">
        <h2></h2>
        <img src={registerImage} alt="App Logo" className="logoo" />
        <h2></h2>
      </div>
      
      {/* Right Side */}
      <div className="registerFormContainer">
        <div className="registerContainer2">
          <h2>LOGIN</h2>
          <form className="formClass">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="form3Example"
              className="field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="form3Example2"
              className="field"
              required
            />
            <button
              type="button"
              className="buttonn"
              onClick={logInUser}
            >
              Login
            </button>
          </form>
          <p className="ask">
            Belum punya akun?<Link to="/register" className="linkk"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}