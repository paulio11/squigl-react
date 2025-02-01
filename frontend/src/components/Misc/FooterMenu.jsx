import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import styles from "./FooterMenu.module.css";

const FooterMenu = ({ id, isOwner }) => {
  const [show, setShow] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [copyLinkText, setCopyLinkText] = useState("Copy link");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5173/p/${id}`);
      setCopyLinkText("Link copied!");
      setTimeout(() => {
        setCopyLinkText("Copy link");
      }, 3000);
    } catch (error) {}
  };

  return (
    <div className={styles.footerMenu}>
      <i
        className={`fa-solid fa-bars ${styles.menuToggle}`}
        onClick={() => setShow(!show)}
      ></i>
      {show && (
        <div className={styles.menuContainer} ref={menuRef}>
          <Link onClick={copyLink}>
            <i className="fa-solid fa-link"></i>
            {copyLinkText}
          </Link>
          {isOwner && (
            <Link to={`/p/edit/${id}`}>
              <i className="fa-solid fa-pen-to-square"></i>Edit
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default FooterMenu;
