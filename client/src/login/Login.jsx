import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Buat file CSS terpisah untuk styling
import registerImage from "../assets/logo.png"; // Sesuaikan path gambar

export default function AuthPage({ type }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", repeatPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
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
          <form onSubmit={handleSubmit} className="formClass">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="field"
              required
            />
            <button
              type="submit"
              className="buttonn"
            >
              Login
            </button>
          </form>
          <p className="ask">
            Belum punya akun? Register
          </p>
        </div>
      </div>
    </div>
  );
}