import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { createTags } from "../../utils/createTags";
import styles from "./Post.module.css";
import Avatar from "../Avatar/Avatar";
import LikeButton from "../Misc/LikeButton";
import FooterReplyIcon from "../Misc/FooterReplyIcon";
import FooterMenu from "../Misc/FooterMenu";
import { useAuth } from "../../contexts/AuthContext";

const Post = ({ ...post }) => {
  const { user } = useAuth();
  const {
    owner,
    body,
    date,
    image,
    display_name,
    avatar,
    id,
    reply_count,
    parent_post_id,
    parent_post_owner,
    parent_post_body,
    parent_post_dname,
    parent_post_image,
    parent_post_avatar,
    like_count,
    like_id,
    view_count,
    user_has_replied_to,
  } = post;
  const isOwner = owner === user?.username;
  const nav = useNavigate();

  return (
    <Card className={styles.post}>
      {parent_post_id && (
        <Card.Body
          className={styles.parentPostHeader}
          onClick={() => nav(`/p/${parent_post_id}`)}
        >
          <div className={styles.parentPostHeaderLeft}>
            <Avatar
              image={parent_post_avatar}
              size={"reply"}
              username={parent_post_owner}
              parent_post_id={parent_post_id}
            />
            <div>
              <span className="text-muted">Replying to </span>
              <strong>{parent_post_dname || parent_post_owner}</strong>{" "}
              <span className="text-muted">@{parent_post_owner}</span>
              <div>{createTags(parent_post_body)}</div>
            </div>
          </div>
          {parent_post_image && (
            <Link to={`/p/${parent_post_id}`}>
              <img src={parent_post_image} className={styles.parentPostImage} />
            </Link>
          )}
        </Card.Body>
      )}
      <Row>
        <Col xs={2} className={styles.leftCol}>
          <Avatar image={avatar} username={owner} size="post" />
        </Col>
        <Col className={styles.rightCol}>
          <Card.Body>
            <div className={styles.header}>
              <Link to={`/u/${owner}`} className="profileLink">
                <strong>{display_name}</strong>{" "}
                <span className="text-muted">@{owner}</span>
              </Link>{" "}
              · <Link to={`/p/${id}`}>{date}</Link>
            </div>
            <Card.Text className={styles.body}>{createTags(body)}</Card.Text>
            {image && (
              <Card.Img src={image} className={styles.image} alt="Post image" />
            )}
          </Card.Body>
        </Col>
      </Row>
      <Card.Footer className={styles.footer}>
        <FooterReplyIcon
          reply_count={reply_count}
          id={id}
          user_has_replied_to={user_has_replied_to}
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

export default Post;
