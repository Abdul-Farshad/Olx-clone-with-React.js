import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  useContext,
} from "react";
import "./Create.css";
import Header from "../Header/Header";
import { AuthContext } from "../../store/Context";
import { storage , db } from "../../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import WithAuth from "../withAuth/withAuth";

const Create = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false)

  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      setIsUploading(true);
      const storageRef = ref(storage, `image/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, "Products"), {
              name,
              category,
              price,
              url: downloadURL,
              userId: user.uid,
              createdAt: Timestamp.fromDate(new Date()),
            })
            .then(() => {
              setName("")
              setCategory("")
              setPrice("")
              setImage(null)
              setUploadProgress(0)
              setIsUploading(false)
            })
            .catch((err)=> {
              console.error(err)
              setIsUploading(false)
            })
          });
        }
      );
    }
  };
  return (
    <Fragment>
      <Header />
      <div className="container">
        <div className="centerDiv">
          <form className="add-product-form" onSubmit={handleSubmit}>
            <label htmlFor="itemName">Name</label>
            <input
              ref={nameRef}
              maxLength={50}
              className="input"
              type="text"
              id="itemName"
              name="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required  
            />
            <br />
            <label htmlFor="category">Category</label>
            <input
              className="input"
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <br />
            <label htmlFor="price">Price</label>

            <input
              className="input"
              type="number"
              id="price"
              name="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <br />
            {image && (
              <img
                alt="Posts"
                className="input-image"
                src={image ? URL.createObjectURL(image) : ""}
              ></img>
            )}
            <div className="file-upload-wrapper">
              <button className="custom-file-upload">Upload File</button>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                className="file-upload-input"
                id=""
                name="image"
                required
              />
            </div>
            <button className="uploadBtn" type="submit" disabled={isUploading} >
              Upload and Submit
            </button>
            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <span className="progressText">{uploadProgress.toFixed(0)}%</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default WithAuth(Create);
