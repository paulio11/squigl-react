import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { backendAPI } from "../../../api/axiosConfig";

const PasswordChangeForm = () => {
  const [messages, setMessages] = useState();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  });
  const { old_password, new_password1, new_password2 } = formData;

  const handleChange = (e) => {
    setMessages();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, status } = await backendAPI.post(
        "/dj-rest-auth/password/change/",
        formData
      );
      if (status === 200) {
        setFormData({
          old_password: "",
          new_password1: "",
          new_password2: "",
        });
        setMessages(data.detail);
      }
    } catch (error) {
      setMessages(error.response?.data);
    }
  };

  return (
    <Form className="mb-5" onSubmit={handleSubmit}>
      <Form.Label>
        <strong>Password:</strong>
      </Form.Label>
      {/* <Form.Control
        className="mb-3"
        placeholder="Old password (not working?)"
        type="password"
        name="old_password"
        value={old_password}
        onChange={handleChange}
        required
      />
      {messages?.old_password && (
        <Alert variant="warning" dismissible>
          {messages.old_password}
        </Alert>
      )} */}
      <Form.Control
        className="mb-3"
        placeholder="New password"
        type="password"
        name="new_password1"
        value={new_password1}
        onChange={handleChange}
        required
      />
      <Form.Control
        className="mb-3"
        placeholder="Confirm new password"
        type="password"
        name="new_password2"
        value={new_password2}
        onChange={handleChange}
        required
      />
      {messages?.new_password2 && (
        <Alert variant="warning">{messages.new_password2}</Alert>
      )}
      <Button
        className="themedButton mb-3"
        type="submit"
        disabled={
          !old_password ||
          !new_password1 ||
          !new_password2 ||
          new_password1 !== new_password2
        }
      >
        Change password
      </Button>
      {messages?.detail && <Alert variant="warning">{messages.detail}</Alert>}
    </Form>
  );
};

export default PasswordChangeForm;
