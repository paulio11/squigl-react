import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/axiosConfig";
import Title from "../../../components/Misc/Title";

const DeleteAccountButton = () => {
  const { setUser } = useAuth();
  const nav = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await backendAPI.delete("/delete/");
        alert("Account successfully deleted.");
        setUser(null);
        nav("/");
      } catch (error) {}
    }
  };

  return (
    <>
      <Title title="Delete account" />
      <Button className="themedButton deleteButton mb-5" onClick={handleDelete}>
        Delete account
      </Button>
    </>
  );
};

export default DeleteAccountButton;
