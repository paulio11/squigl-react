import React from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthContext";
import Title from "../../components/Misc/Title";
import UsernameChangeForm from "./components/UsernameChangeForm";
import ProfileChangeForm from "./components/ProfileChangeForm";
import PasswordChangeForm from "./components/PasswordChangeForm";
import DeleteAccountButton from "./components/DeleteAccountButton";

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Alert variant="light">
        <Link to={"/login"}>Login</Link> to view this page.
      </Alert>
    );
  }

  return (
    <>
      <Title title={"Account settings"} />
      <UsernameChangeForm />
      <PasswordChangeForm />
      <ProfileChangeForm />
      <DeleteAccountButton />
    </>
  );
};

export default Settings;
