import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

import styles from "./SearchResults.module.css";
import { backendAPI } from "../../api/axiosConfig";
import Post from "../../components/Post/Post";
import { useSearch } from "../../contexts/SearchContext";
import Line from "../../components/Line/Line";
import UserCard from "./components/UserCard";

const SearchResults = () => {
  const { query } = useParams();
  const { setSearchQuery } = useSearch();
  const [posts, setPosts] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          backendAPI.get(`/posts/?search=${query}`),
          backendAPI.get(`/profiles/?search=${query}`),
        ]);
        setPosts(postsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    setSearchQuery(query);
    getResults();
  }, [query]);

  if (loading) {
    return "Searching...";
  }

  if (!loading && !posts?.length && !users?.length) {
    return (
      <Alert variant="light">
        There are no results for <strong>{query}</strong>.
      </Alert>
    );
  }

  return (
    <>
      <Tabs
        defaultActiveKey={posts.length ? "posts" : "users"}
        variant="pills"
        className={styles.customTabs}
      >
        {posts?.length > 0 && (
          <Tab
            tabClassName={styles.customTab}
            eventKey="posts"
            title={
              <>
                Posts <Badge className={styles.badge}>{posts.length}</Badge>
              </>
            }
          >
            <Line />
            {posts.map((post, i) => (
              <Post key={i} {...post} />
            ))}
          </Tab>
        )}
        {users?.length > 0 && (
          <Tab
            eventKey="users"
            title={
              <>
                Users <Badge className={styles.badge}>{users.length}</Badge>
              </>
            }
            tabClassName={styles.customTab}
          >
            <Line />
            {users.map((user, i) => (
              <UserCard key={i} {...user} />
            ))}
          </Tab>
        )}
      </Tabs>
    </>
  );
};

export default SearchResults;
