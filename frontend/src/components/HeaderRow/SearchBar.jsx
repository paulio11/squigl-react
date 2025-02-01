import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "./SearchBar.module.css";
import { useSearch } from "../../contexts/SearchContext";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/s/")) {
      setSearchQuery("");
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    nav(`/s/${searchQuery}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          name="search"
          placeholder="Search Squigl"
          value={searchQuery}
          className={styles.searchBar}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className={`themedButton ${styles.searchButton}`} type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
