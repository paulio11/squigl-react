import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";

import styles from "./ScrollToTop.module.css";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const toggleShow = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleShow);

    return () => window.removeEventListener("scroll", toggleShow);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    show && (
      <Button
        onClick={scrollUp}
        className={`${styles.scrollUpButton} themedButton`}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </Button>
    )
  );
};

export default ScrollToTop;
