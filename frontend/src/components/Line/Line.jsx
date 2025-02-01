import React from "react";

import styles from "./Line.module.css";

const Line = () => {
  return (
    <div className={styles.line}>
      <div className={styles.one}></div>
      <div className={styles.two}></div>
      <div className={styles.three}></div>
      <div className={styles.four}></div>
      <div className={styles.five}></div>
    </div>
  );
};

export default Line;
