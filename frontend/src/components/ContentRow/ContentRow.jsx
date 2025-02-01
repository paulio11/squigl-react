import React from "react";
import { Routes, Route } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./ContentRow.module.css";
import LeftNav from "../LeftNav/LeftNav";
import Feed from "../../pages/Feed/Feed";
import SinglePost from "../../pages/SinglePost/SinglePost";
import Profile from "../../pages/Profile/Profile";
import Login from "../../pages/Auth/Login";
import Logout from "../../utils/logout";
import Register from "../../pages/Auth/Register";
import NewPost from "../../pages/NewPost/NewPost";
import Settings from "../../pages/Settings/Settings";
import EditPost from "../../pages/EditPost/EditPost";
import Trending from "../Trending/Trending";
import SearchResults from "../../pages/Search/SearchResults";
import SendMessage from "../../pages/SendMessage/SendMessage";
import Messages from "../../pages/Messages/Messages";
import Home from "../../pages/Home";
import WhoToFollow from "../WhoToFollow/WhoToFollow";

const ContentRow = () => {
  return (
    <Row className={styles.mainRow}>
      <Col xs={2}>
        <LeftNav />
      </Col>
      <Col xs={6} className={styles.middleCol}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/s/:query" element={<SearchResults />} />
          <Route path="/new_post" element={<NewPost />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:tabKey" element={<Messages />} />
          <Route path="/messages/send/:username" element={<SendMessage />} />
          <Route path="/messages/send" element={<SendMessage />} />
          <Route path="/p/:id" element={<SinglePost />} />
          <Route path="/p/edit/:id" element={<EditPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Col>
      <Col xs={3}>
        <Trending />
        <WhoToFollow />
      </Col>
    </Row>
  );
};

export default ContentRow;
