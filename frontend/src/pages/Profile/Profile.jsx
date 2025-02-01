import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./Profile.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/axiosConfig";
import { createTags } from "../../utils/createTags";
import Avatar from "../../components/Avatar/Avatar";
import Post from "../../components/Post/Post";
import Error404 from "../Error/Error404";

const Profile = () => {
  const { username } = useParams();
  const { user, setUser } = useAuth();
  const nav = useNavigate();

  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [profileData, setProfileData] = useState({
    background: "",
    link: "",
    created: "",
    display_name: "",
    bio: "",
    avatar: "",
    verified: false,
    post_count: 0,
    following_count: 0,
    follower_count: 0,
    id: 0,
  });

  const {
    background,
    link,
    id,
    display_name,
    bio,
    avatar,
    verified,
    post_count,
    following_count,
    follower_count,
  } = profileData;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          backendAPI.get(`/profiles/${username}`),
          backendAPI.get(`/posts/?owner__username=${username}`),
        ]);
        setProfileData(profileResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        if (error?.response?.status === 404) {
          setError404(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (user) {
      setIsFollowing(user?.following.includes(profileData?.id));
    }
  }, [user, profileData]);

  const handleFollow = async () => {
    if (!user) return;
    const action = isFollowing ? "remove" : "add";

    try {
      const { status } = await backendAPI.patch(`/profiles/${user?.username}`, {
        action,
        id: id,
      });

      if (status === 200) {
        setIsFollowing(!isFollowing);
        setProfileData({
          ...profileData,
          follower_count:
            action === "add" ? follower_count + 1 : follower_count - 1,
        });
        setUser({
          ...user,
          following: isFollowing
            ? user.following.filter((item) => item !== id)
            : [...user.following, id],
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const handleMessage = () => {
    nav(`/messages/send/${username}`);
  };

  if (loading) {
    return;
  }

  if (error404) {
    return <Error404 type="user" />;
  }

  return (
    <>
      <Card className={styles.userCard}>
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${background})` }}
        ></div>
        <Avatar image={avatar} username={username} size="profile" />
        <div className={styles.userButtons}>
          {user?.profile_id === id ? (
            <Button className="themedButton" onClick={() => nav("/settings")}>
              Update profile
            </Button>
          ) : (
            <>
              <Button
                className="themedButton"
                onClick={handleFollow}
                disabled={!user}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button
                className="themedButton"
                onClick={handleMessage}
                disabled={!user}
              >
                Message
              </Button>
            </>
          )}
        </div>
        <Card.Body>
          <Card.Title>
            <h4>
              {display_name}
              {verified && (
                <i className="fa-solid fa-square-check verified"></i>
              )}
            </h4>
            <p className={`text-muted ${styles.username}`}>@{username}</p>
          </Card.Title>
          <div>
            <p className={styles.bio}>{createTags(bio)}</p>
            {link && (
              <p>
                <i className="fa-solid fa-link"></i>{" "}
                <a href={link} target="_blank">
                  {link}
                </a>
              </p>
            )}
          </div>
        </Card.Body>
        <Card.Footer className={styles.footer}>
          <span>
            <strong>{follower_count}</strong>{" "}
            {follower_count === 1 ? "Follower" : "Followers"}
          </span>
          <span>
            <strong>{following_count}</strong> Following
          </span>
          <span>
            <strong>{post_count}</strong> {post_count === 1 ? "Post" : "Posts"}
          </span>
        </Card.Footer>
      </Card>
      {posts.length === 0 && (
        <Alert variant="light">@{username} has not posted yet!</Alert>
      )}
      {posts?.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </>
  );
};

export default Profile;
