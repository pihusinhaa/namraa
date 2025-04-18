import React, { useState } from "react";
import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; // ✅ Adjust this path if needed

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <h1 className="logo">Namra</h1>
        <p className="tagline">Your Safe Space, Always.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Forgot your password?</h2>
          <p className="card-subtitle">
            Please enter your email to reset your password.
          </p>
        </div>

        <form className="form" onSubmit={handlePasswordReset}>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Send Reset Link
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <Link to="/login">
          <span>Log in</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
