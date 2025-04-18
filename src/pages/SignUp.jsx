import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // adjust the path if needed

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate(); // hook to navigate after signup

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all the fields.");
      return;
    }

    if (!agreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", userCredential.user);
      alert("Signup successful!");
      navigate("/dashboard"); // redirect after successful signup
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
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
          <h2 className="card-title">Nice to see you!</h2>
          <p className="card-subtitle">Create your account</p>
        </div>

        <form className="form" onSubmit={handleSignup}>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            placeholder="Lily Amber"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="lilyamber@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            placeholder="Ammn1234@"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="checkbox-container">
            <input
              type="checkbox"
              className="checkbox"
              id="terms"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree with Terms & Conditions
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Create account
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
