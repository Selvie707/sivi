import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdatePayment.css";
import Navbar from '../components/navbar/Navbar';

const UpdatePaymentStatus = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data pengguna dari backend
    axios.get("http://127.0.0.1:5000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleUpdatePayment = (email) => {
    axios.post("http://127.0.0.1:5000/update-payment", { email })
      .then((response) => {
        alert("Payment status updated successfully!");
        // Update status pengguna di state setelah berhasil diupdate
        setUsers(users.map(user => user.email === email ? { ...user, is_paid: true } : user));
      })
      .catch((error) => {
        alert("Error updating payment status");
        console.error("Error:", error);
      });
  };

  const handleUpdateRole = (email) => {
    axios.post("http://127.0.0.1:5000/update-role", { email })
      .then((response) => {
        alert("Role berhasil diubah!");
        // Update status pengguna di state setelah berhasil diupdate
        setUsers(users.map(user => user.email === email ? { ...user, role: "admin" } : user));
      })
      .catch((error) => {
        alert("Error updating role");
        console.error("Error:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <div className="headingg">
        <button className="close-buttonn" onClick={() => navigate("/")}>✖</button>
        <h2 className="heading">LIST PENGGUNA</h2>
      </div>
      
      <table border="1" style={{ width: "95%", margin: "0 auto", marginTop: "52px" }} className="content-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status Pembayaran</th>
            <th>Update Status</th>
            <th>Update Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_paid ? "Telah Bayar" : "Belum Bayar"}</td>
              <td>
                {!user.is_paid && (
                  <button onClick={() => handleUpdatePayment(user.email)} className="button-payment">Update Status</button>
                )}
              </td>
              <td>
                {user.role === "user" && (
                  <button onClick={() => handleUpdateRole(user.email)} className="button-role">Update Role</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdatePaymentStatus;
