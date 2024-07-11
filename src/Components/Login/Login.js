import React, { useState, useContext } from "react";
import WithNoAuth from "../withAuth/WithNoAuth";
import Logo from "../../olx-logo.png";
import "./Login.css";
import { FirebaseContext } from "../../store/Context";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);
  const auth = getAuth(firebase);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setError("Invalid credential");
      });
  };
  return (
    <div className="loginContainer">
      <div className="loginParentDiv">
        <img className="logo" src={Logo} alt="logo"></img>
        <form onSubmit={handleLogin}>
          {error && <p className="errMsg">{error}</p>}

          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="lname"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button>{loading ? "Login..." : "Login"}</button>
        </form>
        <a href="/signup">Signup</a>
      </div>
    </div>
  );
}

export default WithNoAuth(Login);
