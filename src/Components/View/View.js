import React, { useContext, useEffect, useState } from "react";
import "./View.css";
import { Container, Row, Col } from "react-bootstrap";
import { FirebaseContext } from "../../store/Context";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

function View() {
  const [userDetails, setUserDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, "Products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const postData = productSnap.data();
          const updatedData = {
            ...postData,
            createdAt: postData.createdAt.toDate().toDateString(),
          };
          setProductDetails(updatedData);
          // fetch user data
          fetchUserDetails(postData.userId);
        } else {
          console.error("No such post!");
        }
      } catch (err) {
        console.error("Fetching product details error: ", err);
      }
    };

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

    fetchProductDetails();
  }, [db, productId]);

  return (
    <Container fluid className="viewParentDiv">
      {productDetails && (
        <Row>
          <Col xs={12} md={8} className="imageShowDiv">
            <img src={productDetails.url} className="img-fluid" alt="" />
          </Col>

          <Col xs={12} md={4} className="rightSection">
            <div className="productDetails">
              <p>&#x20B9; {productDetails.price}</p>
              <span name="product-name" className="product-name">
                {productDetails.name}
              </span>
              <p name="category" className="product-category">
                {productDetails.category}
              </p>
              <p name="created-date" className="created-date">
                {productDetails.createdAt}
              </p>
            </div>
            {userDetails && (
              <div className="contactDetails">
                <p className="section-title">Seller Details</p>
                <div className="detail-row">
                  <span className="detail-key">Name:</span>
                  <span className="detail-value">{userDetails.userName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Contact:</span>
                  <span className="detail-value">{userDetails.phone}</span>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default View;
