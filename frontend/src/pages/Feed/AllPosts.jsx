import React, { useEffect, useState } from "react";
import { backendAPI } from "../../api/axiosConfig";
import Post from "../../components/Post/Post";

const AllPosts = () => {
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await backendAPI.get("/posts/");
        setPosts(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    getPosts();
  }, []);

  if (loading) {
    return;
  }

  return (
    <>
      {posts.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </>
  );
};

export default AllPosts;
