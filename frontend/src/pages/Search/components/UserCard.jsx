import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./UserCard.module.css";
import Avatar from "../../../components/Avatar/Avatar";

const UserCard = (user) => {
  const { avatar, background, display_name, username } = user;
  const nav = useNavigate();

  return (
    <div
      className={styles.userCard}
      style={{ backgroundImage: `url(${background || null})` }}
      onClick={() => nav(`/u/${username}`)}
    >
      <Avatar image={avatar} size="search" username={username} />
      <div className={styles.name}>
        <h4>{display_name}</h4>
        <span>@{username}</span>
      </div>
    </div>
  );
};

export default UserCard;
