import React from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { createTags } from "../../utils/createTags";
import LikeButton from "../Misc/LikeButton";
import styles from "./Reply.module.css";
import Avatar from "../Avatar/Avatar";
import FooterReplyIcon from "../Misc/FooterReplyIcon";
import FooterMenu from "../Misc/FooterMenu";
import { useAuth } from "../../contexts/AuthContext";

const Reply = (props) => {
  const { user } = useAuth();
  const {
    avatar,
    body,
    date,
    display_name,
    id,
    owner,
    reply_count,
    like_count,
    like_id,
    view_count,
    user_has_replied_to,
    image,
  } = props;
  const isOwner = user?.username === owner;

  return (
    <Card className={styles.replyCard}>
      <Card.Body className={styles.replyCardBody}>
        <Row>
          <Col xs={1} className={styles.avatarCol}>
            <Avatar image={avatar} size={"reply"} username={owner} />
          </Col>
          <Col>
            <div className={styles.header}>
              <Link to={`/u/${owner}`} className="profileLink">
                <strong>{display_name}</strong>{" "}
                <span className="text-muted">@{owner}</span>
              </Link>
              {" · "}
              <Link to={`/p/${id}`}>
                <strong>{date}</strong>
              </Link>
            </div>
            <div className={`${styles.body} mb-2`}>{createTags(body)}</div>
            {image && <img src={image} className={styles.image} />}
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className={styles.footer}>
        <FooterReplyIcon
          id={id}
          user_has_replied_to={user_has_replied_to}
          reply_count={reply_count}
        />
        <div>
          <LikeButton post={id} like_id={like_id} like_count={like_count} />
        </div>
        <div>
          <i className="fa-solid fa-chart-simple"></i> {view_count}
        </div>
        <FooterMenu id={id} isOwner={isOwner} />
      </Card.Footer>
    </Card>
  );
};

export default Reply;
