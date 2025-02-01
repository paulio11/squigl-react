import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./SendMessage.module.css";
import { useAuth } from "../../contexts/AuthContext";
import Title from "../../components/Misc/Title";
import { backendAPI } from "../../api/axiosConfig";

const SendMessage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [errors, setErrors] = useState([]);
  const [messageData, setMessageData] = useState({
    recipient: username || "",
    message: "",
  });

  const handleChange = (e) => {
    setErrors([]);
    setMessageData({
      ...messageData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.post("/messages/", messageData);
      if (status === 201) {
        nav("/messages/sent");
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  if (!user) {
    return (
      <Alert variant="light">
        <Link to={"/login"}>Login</Link> to send a message to another user.
      </Alert>
    );
  }

  return (
    <>
      <Title title={"Send message"} />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>To:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            name="recipient"
            value={messageData.recipient}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Message:</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            rows={10}
            maxLength={400}
            value={messageData.message}
            placeholder={`What would you like to say${
              username ? ` to @${username}?` : "?"
            }`}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <div className={styles.buttonRow}>
          <span>{messageData.message.length}/400</span>
          <Button
            className="themedButton"
            disabled={!messageData.message || !messageData.recipient}
            type="submit"
          >
            Send message
          </Button>
        </div>
      </Form>
      {Object.entries(errors).map(([key, messages]) =>
        messages.map((message, i) => (
          <Alert key={`${key}-${i}`} variant="warning">
            {message}
          </Alert>
        ))
      )}
    </>
  );
};

export default SendMessage;
