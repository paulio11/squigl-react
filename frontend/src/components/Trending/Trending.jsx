import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import styles from "./Trending.module.css";
import { backendAPI } from "../../api/axiosConfig";
import Line from "../Line/Line";

const Trending = () => {
  const [trendingTags, setTrendingTags] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTrendingTags = async () => {
      setLoading(true);
      try {
        const { data } = await backendAPI.get("/hashtags/trending");
        setTrendingTags(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getTrendingTags();
  }, []);

  if (loading) {
    return;
  }

  return (
    <>
      <h4>Trending tags</h4>
      <Line />
      {trendingTags?.length === 0 && (
        <Alert variant="light">Nothing is trending!</Alert>
      )}
      {trendingTags?.map((tag, i) => (
        <Link key={i} className={styles.tagContainer} to={`/s/${tag.tag}`}>
          <div className={styles.tagSymbol}>#</div>
          <div className={styles.tagText}>
            <div className={styles.tag}>{tag.tag}</div>
            <div className={styles.count}>
              {tag.count} {tag.count === 1 ? "post" : "posts"}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Trending;
