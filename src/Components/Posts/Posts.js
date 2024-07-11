import React, { userState, useEffect, useContext, useState } from "react";
import Heart from "../../assets/Heart";
import "./Post.css";
import { FirebaseContext } from "../../store/Context";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function Posts() {
  const firebase = useContext(FirebaseContext);
  const db = getFirestore(firebase);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // fetch products for display on home page
    const fetchProducts = async () => {
      const productsCollection = collection(db, "Products");
      const q = query(productsCollection, orderBy("createdAt", "desc"));
      const productsSnapshot = await getDocs(q);
      const productsList = productsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toDateString(),
        };
      });
      setProducts(productsList);
      console.log("product list", productsList);
    };
    fetchProducts();
  }, []);
  return (
    <Container fluid className="postParentDiv">
      <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
        </div>
        <div className="cards">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product, index) => (
            <Col key={index}>
              <div
                className="card"
                onClick={() => {
                  navigate(`/view/${product.id}`);
                }}
              >
                <div className="fav-icon-container">
                  <span className="favorite">
                    <Heart />
                  </span>
                </div>
                <div className="image">
                  <img src={product.url} alt="" />
                </div>
                <div className="content">
                  <p className="rate">&#x20B9; {product.price}</p>
                  <p className="name">{product.name}</p>
                  <p className="category">{product.category}</p>
                </div>
                <div className="date">
                  <span>{product.createdAt}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        </div>
      </div>
    </Container>
  );
}

export default Posts;
