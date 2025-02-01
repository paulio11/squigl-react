import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Alert from "react-bootstrap/Alert";

import Title from "../../components/Misc/Title";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [loginData, setLoginData] = useState({});
  const { username, password } = loginData;
  const [errors, setErrors] = useState(false);
  const { user, handleLogin } = useAuth();

  const handleChange = (e) => {
    setErrors(false);
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleLogin(loginData);
    if (error) {
      setErrors(error);
    }
  };

  if (user) {
    return "You are already logged in.";
  }

  return (
    <>
      <Title title="Login" />
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
            name="password"
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        {errors.password?.map((message, i) => (
          <Alert key={i} variant="warning">
            {message}
          </Alert>
        ))}
        <div style={{ textAlign: "right", marginBottom: "16px" }}>
          <Button
            className="themedButton"
            type="submit"
            disabled={!username || !password || errors}
          >
            Login
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

export default Login;
