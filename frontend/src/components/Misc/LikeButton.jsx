import React, { useState } from "react";

import styles from "./LikeButton.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/axiosConfig";

const LikeButton = ({ post, like_id, like_count }) => {
  const [count, setCount] = useState(like_count);
  const [id, setID] = useState(like_id);
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user) return;

    try {
      if (id) {
        const { status } = await backendAPI.delete(`/likes/${id}`);
        if (status === 204) {
          setCount(count - 1);
          setID(null);
        }
      } else {
        const { data, status } = await backendAPI.post("/likes/", { post });
        if (status === 201) {
          setCount(count + 1);
          setID(data.id);
        }
      }
    } catch (error) {}
  };

  const heartClass = `${styles.likeHeart} ${
    id ? `${styles.likedHeart} fa-solid` : "fa-regular"
  } fa-heart`;

  return (
    <>
      <i className={heartClass} onClick={handleClick}></i> {count}
    </>
  );
};

export default LikeButton;
