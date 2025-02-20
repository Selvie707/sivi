import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Buat file CSS terpisah untuk styling
import registerImage from "../assets/logo.png"; // Sesuaikan path gambar

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');

  const navigate = useNavigate();

  const registerUser = () => {
    if(username.length === 0){
      alert("Username blank!")
    } else if(email.length === 0){
      alert("Email blank!")
    } else if(password.length === 0){
      alert("Password blank!")
    } else if(password !== repPassword){
      alert("Password not match!")
    } else{
      const is_paid = false
      const role = "user";

      axios.post('http://127.0.0.1:5000/signup', {
        username: username,
        email: email,
        password: password,
        is_paid: is_paid,
        role: role
      })
      .then(function (response) {
        console.log(response);
        navigate("/login ");
      })
      .catch(function (error) {
        console.log(error, 'error');
        if (error.response.status === 409 ) {
          alert("Email already exist!");
        }
      });
    }
  }

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
          <h2>REGISTER</h2>
          <form className="formClass">
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="form3Example2"
                className="field"
                required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="form3Example3"
              className="field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="form3Example4"
              className="field"
              required
            />
            <input
                type="password"
                name="repeatPassword"
                placeholder="Repeat Password"
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
                id="form3Example5"
                className="field"
                required
            />
            <button
              type="button"
              className="buttonn"
              onClick={() => registerUser()}
            >
              Register
            </button>
          </form>
          <p className="ask">
            Sudah punya akun?<Link to="/login" className="linkk"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}