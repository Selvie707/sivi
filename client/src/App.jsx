import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import "./App.css";
import Login from "./login/Login.jsx";
import Register from "./register/Register.jsx";
import Recognition from "./recognition/Recognition.jsx";
import UpdatePaymentStatus from "./updatePayment/UpdatePaymentStatus.jsx";
import Unauthorized from "./pages/unauthorized/Unauthorized.jsx";
import Learn from "./pages/learn/Learn.jsx";

// Pastikan PrivateRoute menerima requiredRole
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute khusus admin */}
        <Route
          path="/updatePayment"
          element={
            <AdminRoute>
              <UpdatePaymentStatus />
            </AdminRoute>
          }
        />

        {/* Rute yang membutuhkan login tetapi tanpa role spesifik */}
        <Route path="/" element={<PrivateRoute><Recognition /></PrivateRoute>} />

        <Route path="/learn" element={<Learn />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
