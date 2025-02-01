import React from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const Error404 = ({ type }) => {
  return (
    <>
      <Alert variant="warning">
        The {type} you were looking for could not be found.
      </Alert>
      <Button
        className="themedButton"
        onClick={() => {
          window.history.back();
        }}
      >
        <i className="fa-solid fa-arrow-left"></i> Go back
      </Button>
    </>
  );
};

export default Error404;
