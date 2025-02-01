import React from "react";
import { Link } from "react-router-dom";

import styles from "./Avatar.module.css";

const Avatar = ({ image, username, size, parent_post_id }) => {
  return (
    <Link to={parent_post_id ? `/p/${parent_post_id}` : `/u/${username}`}>
      <img
        src={image}
        className={`${styles.avatar} ${styles[size]}`}
        alt={`Avatar of ${username}`}
      />
    </Link>
  );
};

export default Avatar;
