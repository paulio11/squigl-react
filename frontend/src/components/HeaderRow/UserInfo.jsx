import React from "react";
import { Link } from "react-router-dom";

import styles from "./UserInfo.module.css";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../Avatar/Avatar";

const UserInfo = () => {
  const { user } = useAuth();
  const { avatar, display_name, username } = user;

  return (
    <div className={styles.mainDiv}>
      <Link to={`/u/${username}`}>
        <h5 className="text-muted">@{username}</h5>
        <h4>{display_name}</h4>
      </Link>
      <Avatar image={avatar} username={username} size="header" />
    </div>
  );
};

export default UserInfo;
