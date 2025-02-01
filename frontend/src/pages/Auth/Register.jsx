import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/axiosConfig";
import Title from "../../components/Misc/Title";

const Register = () => {
  const [registerData, setRegisterData] = useState({});
  const { username, password1, password2 } = registerData;
  const [errors, setErrors] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    setErrors(false);
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.post(
        "/dj-rest-auth/registration/",
        registerData
      );
      if (status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      if (error.status === 400) {
        setErrors(error.response.data);
      }
    }
  };

  if (success) {
    return (
      <Alert variant="light">
        You have successfully registered. You can now{" "}
        <Link to={"/login"}>login</Link>.
      </Alert>
    );
  }

  if (user) {
    return "You are already registered.";
  }

  return (
    <>
      <Title title="Register" />
      <Form onSubmit={handleSubmit}>
        <FloatingLabel label="Username" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        {errors.username?.map((message, i) => (
          <Alert key={i} variant="warning">
            {message}
          </Alert>
        ))}
        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password1"
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        {errors.password1?.map((message, i) => (
          <Alert key={i} variant="warning">
            {message}
          </Alert>
        ))}
        <FloatingLabel label="Confirm password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="password2"
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        {errors.password2?.map((message, i) => (
          <Alert key={i} variant="warning">
            {message}
          </Alert>
        ))}
        <div style={{ textAlign: "right", marginBottom: "16px" }}>
          <Button
            className="themedButton"
            type="submit"
            disabled={
              !username || !password1 || !password2 || password1 !== password2
            }
          >
            Register
          </Button>
        </div>
        {errors.non_field_errors?.map((message, i) => (
          <Alert key={i} variant="warning">
            {message}
          </Alert>
        ))}
      </Form>
    </>
  );
};

export default Register;
