import React, { useState, useRef , useEffect } from "react";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();
  const confirmPassRef = useRef(null);
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current.focus()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password do not match!");
      confirmPassRef.current.focus();
      return;
    }
    setLoading(true);
    setError(false);

    try {
      // Sign up process
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCred || !userCred.user) {
        throw new Error("User creation failed");
      }
      await updateProfile(userCred.user, { displayName: userName });

      // Add other data to fireStore db
      await addDoc(collection(db, "users"), {
        id: userCred.user.uid,
        userName,
        phone,
      });

      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setError("Email address is already in use. Please use a different email.");
      }
      console.error(err.message);
    }
  };
  return (
    <div className="signupContainer">
      <div className="signupParentDiv">
        <img className="logo" src={Logo} alt="Logo"></img>
        <form onSubmit={handleSubmit}>
          {error && <p className="errorMsg">{error}</p>}
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            type="text"
            id="fname"
            value={userName}
            name="name"
            onChange={(e) => setUserName(e.target.value)}
            ref={nameRef}
            required
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="phoneNumber">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            id="number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            ref={confirmPassRef}
            required
          />
          <br />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        <a href="/login">Login</a>
      </div>
    </div>
  );
}
