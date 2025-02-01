import React from "react";

import Button from "react-bootstrap/Button";

import Logo from "../../components/HeaderRow/Logo";

const NetworkError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="mt-4">
      <Logo />
      <h2>Network Error</h2>
      <p>
        We're experiencing issues connecting to our backend server. Please try
        again later.
      </p>
      <Button className="themedButton" onClick={handleRefresh}>
        Try again
      </Button>
    </div>
  );
};

export default NetworkError;
