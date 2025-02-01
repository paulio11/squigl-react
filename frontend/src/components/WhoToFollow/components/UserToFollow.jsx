import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./UserToFollow.module.css";
import Avatar from "../../../components/Avatar/Avatar";

const UserToFollow = (props) => {
  const { avatar, username, display_name, id } = props;
  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <Avatar image={avatar} username={username} size="sidebar" />
      <div className={styles.userDetails} onClick={() => nav(`/u/${username}`)}>
        <div className={styles.username}>@{username}</div>
        <div className={styles.displayname}>{display_name}</div>
      </div>
    </div>
  );
};

export default UserToFollow;
