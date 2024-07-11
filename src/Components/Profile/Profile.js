import React, { useContext, useEffect, useState } from "react";
import "./profile.css";
import { Container } from "react-bootstrap";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext, FirebaseContext } from "../../store/Context";
import UserIcon from "../../assets/UserIcon";
import { useNavigate } from "react-router-dom";
import WithAuth from '../withAuth/withAuth'
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Profile() {
  const { user } = useContext(AuthContext);
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const auth = getAuth(firebase);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserDetails = async (userId) => {
        try {
          const userRef = collection(db, "users");
          const q = query(userRef, where("id", "==", userId));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setUserDetails(doc.data());
            });
          } else {
            console.error("No such user!");
          }
        } catch (err) {
          console.error("Fetching user details error:", err);
        }
      };
      fetchUserDetails(user.uid);
    }
  }, [user]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      navigate("/login");
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="profile-container">
        <div className="user-icon-container">
          <UserIcon />
        </div>
        <div className="user-details">
          <div className="user-detail-row">
            <span className="user-detail-key">Username:</span>
            <span className="user-detail-value">
              {user.displayName || "Username not available"}
            </span>
          </div>
          <div className="user-detail-row">
            <span className="user-detail-key">Email:</span>
            <span className="user-detail-value">
              {user.email || "Email not available"}
            </span>
          </div>
          <div className="user-detail-row">
            <span className="user-detail-key">Phone:</span>
            <span className="user-detail-value">
              {userDetails && userDetails.phone
                ? userDetails.phone
                : "Not available"}
            </span>
          </div>
        </div>
        <div className="logout-btn-container">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </Container>
  );
}

export default WithAuth(Profile);
