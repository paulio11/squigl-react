import React from "react";
import { Link } from "react-router-dom";

import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <Link to={"/"} className={styles.link}>
      <h1>
        <span className={styles.logoSquigl}>#</span>squ
        <span className={styles.logoi}>i</span>gl
      </h1>
    </Link>
  );
};

export default Logo;
