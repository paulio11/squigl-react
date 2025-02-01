import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./NewPost.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/axiosConfig";
import Title from "../../components/Misc/Title";

const NewPost = () => {
  const { user } = useAuth();
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [postData, setPostData] = useState({
    body: "",
    image: "",
  });
  const { body, image } = postData;
  const imageInput = useRef();
  const nav = useNavigate();

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setPostData({
      ...postData,
      image: "",
    });
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleBodyChange = (e) => {
    setErrors([]);
    setPostData({
      ...postData,
      body: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("body", body);
    if (imageInput.current.files.length > 0) {
      setUploading(true);
      formData.append("image", imageInput.current.files[0]);
    }
    try {
      const { status, data } = await backendAPI.post("/posts/", formData);
      if (status === 201) {
        nav(`/p/${data.id}`);
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <Alert variant="light">
        <Link to={"/login"}>Login</Link> to create a new post.
      </Alert>
    );
  }
  return (
    <>
      <Title title="New Post" />
      <Form onSubmit={handleSubmit}>
        <Form.Control
          as={"textarea"}
          name="body"
          rows={10}
          maxLength={140}
          placeholder="Add text to your post (optional)"
          onChange={handleBodyChange}
        />
        <Form.Control
          type="file"
          accept="images/*"
          name="image"
          onChange={handleImageChange}
          ref={imageInput}
          style={{ display: "none" }}
        />
        <div className={styles.buttonRow}>
          <Button
            onClick={() =>
              image ? handleRemoveImage() : imageInput.current.click()
            }
            className="themedButton"
          >
            {image ? "Remove image" : "Add image (optional)"}
          </Button>
          <div>
            {body.length} / 140
            <Button
              type="submit"
              disabled={!body && !image}
              className="themedButton"
            >
              {uploading ? "Uploading" : "Post"}
            </Button>
          </div>
        </div>
      </Form>
      {Object.entries(errors).map(([key, messages]) =>
        messages.map((message, i) => (
          <Alert key={`${key}-${i}`} variant="warning">
            {message}
          </Alert>
        ))
      )}
      {image && <img src={image} className={styles.image} />}
    </>
  );
};

export default NewPost;
