import React from "react";
import { Link } from "react-router-dom";

import styles from "./FooterReplyIcon.module.css";

const FooterReplyIcon = ({ id, user_has_replied_to, reply_count }) => (
  <div>
    <Link className={styles.commentLink} to={`/p/${id}`}>
      <i
        className={`fa-${
          user_has_replied_to ? `solid ${styles.repliedTo}` : "regular"
        } fa-comment`}
      ></i>
    </Link>
    {reply_count}
  </div>
);

export default FooterReplyIcon;
