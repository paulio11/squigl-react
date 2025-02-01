import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import Post from "../../components/Post/Post";
import Reply from "../../components/Reply/Reply";
import { backendAPI } from "../../api/axiosConfig";
import NewReplyForm from "../../components/Reply/NewReplyForm";
import { useAuth } from "../../contexts/AuthContext";
import Error404 from "../Error/Error404";

const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState({});
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPost({});
      setReplies([]);

      try {
        const postResponse = await backendAPI.get(`/posts/${id}`);
        setPost(postResponse.data);
        // Check if reply_count exists before fetching replies
        if (postResponse.data.reply_count) {
          const repliesResponse = await backendAPI.get(
            `/posts/?parent_post_id=${id}`
          );
          setReplies(repliesResponse.data);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setError404(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error404) {
    return <Error404 type="post" />;
  }

  if (loading) {
    return;
  }

  return (
    <>
      <Post {...post} />
      {user ? (
        <NewReplyForm post={id} setReplies={setReplies} />
      ) : (
        <Alert variant="light">
          <Link to={"/login"}>Login</Link> if to like this post or leave a
          comment.
        </Alert>
      )}
      {replies && replies?.map((reply, i) => <Reply key={i} {...reply} />)}
    </>
  );
};

export default SinglePost;
