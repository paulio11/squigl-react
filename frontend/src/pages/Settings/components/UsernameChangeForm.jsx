import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/axiosConfig";

const UsernameChangeForm = () => {
  const { user, setUser } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setErrors([]);
    setNewUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.patch("/dj-rest-auth/user/", {
        username: newUsername,
      });
      if (status === 200) {
        setUser({
          ...user,
          username: newUsername,
        });
        setNewUsername("");
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Label>
        <strong>Username:</strong>
      </Form.Label>
      <Form.Control
        type="text"
        name="username"
        placeholder={user.username}
        value={newUsername}
        onChange={handleChange}
        required
        className="mb-3"
      />
      <Button
        type="submit"
        className="themedButton"
        disabled={user.username === newUsername || !newUsername}
      >
        Update username
      </Button>
      {errors.username?.map((message, i) => (
        <Alert variant="warning" key={i} className="mt-3">
          {message}
        </Alert>
      ))}
    </Form>
  );
};

export default UsernameChangeForm;
