import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./NewReplyForm.module.css";
import { backendAPI } from "../../api/axiosConfig";

const NewReplyForm = (props) => {
  const { post, setReplies, setPost } = props;
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [replyData, setReplyData] = useState({
    body: "",
    image: "",
  });
  const { body, image } = replyData;
  const imageInput = useRef();

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setReplyData({
      ...replyData,
      image: "",
    });
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(image);
      setReplyData({
        ...replyData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleBodyChange = (e) => {
    setErrors([]);
    setReplyData({
      ...replyData,
      body: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("body", body);
    formData.append("parent_post_id", post);
    if (imageInput.current.files.length > 0) {
      setUploading(true);
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const { status, data } = await backendAPI.post("/posts/", formData);
      if (status === 201) {
        setReplies((prevReplies) => [data, ...prevReplies]);
        setReplyData({ body: "", image: "" });
        setPost((prevPost) => ({
          ...prevPost,
          reply_count: prevPost.reply_count + 1,
          user_has_replied_to: true,
        }));
        setShowForm(false);
      }
    } catch (error) {
      setErrors(error.response.data);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button
        className="themedButton mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Reply to post"}
      </Button>
      {showForm && (
        <Form className={styles.replyForm} onSubmit={handleSubmit}>
          <Form.Control
            as={"textarea"}
            placeholder="Add text to your reply (optional)"
            rows={5}
            maxLength={140}
            name="body"
            value={body}
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
          <div className={styles.formFooter}>
            <Button
              onClick={() =>
                image ? handleRemoveImage() : imageInput.current.click()
              }
              className="themedButton"
            >
              {image ? "Remove image" : "Add image (optional)"}
            </Button>
            <div>
              <span>{body.length}/140</span>
              <Button
                type="submit"
                disabled={!body && !image}
                className="themedButton"
              >
                {uploading ? "Uploading" : "Post reply"}
              </Button>
            </div>
          </div>
          {Object.entries(errors).map(([key, messages]) =>
            messages.map((message, i) => (
              <Alert key={`${key}-${i}`} variant="warning">
                {message}
              </Alert>
            ))
          )}
          {image && <img src={image} className={styles.image} />}
        </Form>
      )}
    </>
  );
};

export default NewReplyForm;
