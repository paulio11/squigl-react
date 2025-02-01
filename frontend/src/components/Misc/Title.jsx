import React from "react";

import Line from "../Line/Line";

const Title = ({ title }) => {
  return (
    <>
      <h4 style={{ color: "var(--color2)" }}>{title}</h4>
      <Line />
    </>
  );
};

export default Title;
