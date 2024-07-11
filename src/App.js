import React, { useEffect, useContext } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Components/Login/Login";
import Create from "./Components/Create/Create";
import ViewPost from "./Pages/ViewPost";
import Profile from "./Pages/Profile";
import { AuthContext } from "./store/Context";
import { getAuth } from "firebase/auth";
import ProtectedRoute from "./Components/withAuth/withAuth";

function App() {
  const { setUser } = useContext(AuthContext);
  const auth = getAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create/>} />
          <Route path="/view/:productId" element={<ViewPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
  );
}

export default App;
