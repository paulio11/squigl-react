import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import { backendAPI } from "../../api/axiosConfig";
import Post from "../../components/Post/Post";
import { useAuth } from "../../contexts/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await backendAPI.get("/feed/");
        setPosts(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    getPosts();
  }, []);

  if (!user) {
    return (
      <Alert variant="light">
        <Link to={"/login"}>Login</Link> to view your feed.
      </Alert>
    );
  }

  if (loading) {
    return;
  }

  return (
    <>
      {posts.length === 0 && (
        <Alert variant="light">
          There are no posts in your feed yet. Post something yourself and/or
          follow another user.
        </Alert>
      )}
      {posts.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </>
  );
};

export default Feed;
