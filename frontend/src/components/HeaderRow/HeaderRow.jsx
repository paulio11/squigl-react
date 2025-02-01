import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./HeaderRow.module.css";
import Logo from "./Logo";
import UserInfo from "./UserInfo";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "./SearchBar";

const HeaderRow = () => {
  const { user } = useAuth();

  return (
    <Row className={styles.mainRow}>
      <Col xs={2}>
        <Logo />
      </Col>
      <Col xs={6} className={styles.searchCol}>
        <SearchBar />
      </Col>
      <Col xs={3}>{user && <UserInfo />}</Col>
    </Row>
  );
};

export default HeaderRow;
