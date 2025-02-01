import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./EditPost.module.css";
import { backendAPI } from "../../api/axiosConfig";
import Title from "../../components/Misc/Title";
import { useAuth } from "../../contexts/AuthContext";

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [postData, setPostData] = useState({
    body: "",
    image: "",
    owner: "",
    parent_post_id: "",
  });
  const { body, image, owner, parent_post_id } = postData;
  const isOwner = owner === user?.username;
  const [errors, setErrors] = useState();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const imageInput = useRef();
  const nav = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await backendAPI.get(`/posts/${id}`);
        setPostData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    getPost();
  }, [id]);

  const handleBodyChange = (e) => {
    setErrors();
    setPostData({
      ...postData,
      body: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
    setImageRemoved(false);
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setPostData({
      ...postData,
      image: "",
    });
    setImageRemoved(true);
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("body", body);

    // Append the image file if a new one is selected
    if (imageInput.current.files.length > 0) {
      formData.append("image", imageInput.current.files[0]);
    }

    // Append the imageRemoved flag if the image has been removed
    if (imageRemoved) {
      formData.append("imageRemoved", true);
    } else if (image) {
      // Append a flag to indicate the existing image should be retained
      formData.append("retainImage", true);
    }

    try {
      const { status } = await backendAPI.patch(`/posts/${id}`, formData);
      if (status === 200) {
        nav(`/p/${id}`);
      }
    } catch (error) {
      setErrors(error.response.data);
      console.log(errors);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete this ${
        parent_post_id ? "reply" : "post"
      }?`
    );
    if (!userConfirmed) {
      return;
    }
    try {
      const { status } = await backendAPI.delete(`/posts/${id}`);
      if (status === 204) {
        nav("/feed");
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  if (loading) {
    return;
  }

  if (!loading && !isOwner) {
    return (
      <Alert variant="light">
        You must be the owner of this post to edit it.
      </Alert>
    );
  }

  return (
    <>
      <Title title={`Editing ${parent_post_id ? "reply" : "post"} ${id}`} />
      <Button
        className="themedButton mb-3"
        onClick={() => {
          window.history.back();
        }}
      >
        <i className="fa-solid fa-arrow-left"></i> Go back
      </Button>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          as={"textarea"}
          name="body"
          rows={10}
          maxLength={140}
          value={body}
          placeholder="Add text to your post (optional)"
          onChange={handleBodyChange}
        />
        <Form.Control
          type="file"
          accept="images/*"
          name="image"
          style={{ display: "none" }}
          ref={imageInput}
          onChange={handleImageChange}
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
              {uploading ? "Uploading" : "Save changes"}
            </Button>
            <Button
              className="themedButton deleteButton"
              onClick={handleDelete}
            >
              Delete {parent_post_id ? "reply" : "post"}
            </Button>
          </div>
        </div>
      </Form>
      {errors && <Alert variant="warning">{errors?.detail}</Alert>}
      {image && <img src={image} className={styles.image} />}
    </>
  );
};

export default EditPost;
