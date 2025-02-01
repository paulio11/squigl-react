import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import styles from "./Messages.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/axiosConfig";
import Message from "./components/Message";
import Line from "../../components/Line/Line";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { tabKey } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const { data } = await backendAPI.get(`/messages/`);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getMessages();
    }
  }, []);

  // Filter messages
  const sent_messages = messages.filter(
    (message) => message.sender === user?.username
  );

  const received_messages = messages.filter(
    (message) => message.recipient === user?.username
  );

  const unread_messages = received_messages.filter(
    (message) => message.read === false
  );

  if (!user) {
    return (
      <Alert variant="light">
        <Link to={"/login"}>Login</Link> to see your messages.
      </Alert>
    );
  }

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <>
      <Button
        className={`${styles.sendButton} themedButton`}
        onClick={() => nav("/messages/send")}
      >
        <i class="fa-solid fa-pen-to-square"></i> Send message
      </Button>
      <Tabs
        variant="pills"
        defaultActiveKey={tabKey || ""}
        className={styles.customTabs}
      >
        <Tab
          eventKey="unread"
          tabClassName={styles.customTab}
          title={
            <>
              Unread
              {unread_messages.length > 0 && (
                <Badge className={styles.badge}>
                  {" "}
                  {unread_messages.length}
                </Badge>
              )}
            </>
          }
        >
          <Line />
          {user?.unread_messages === 0 && (
            <Alert variant="light">You have no unread messages.</Alert>
          )}
          {unread_messages.map((message, i) => (
            <Message key={i} {...message} setMessages={setMessages} />
          ))}
        </Tab>
        <Tab eventKey="inbox" tabClassName={styles.customTab} title="Inbox">
          <Line />
          {received_messages.length === 0 && (
            <Alert variant="light">You have no messages.</Alert>
          )}
          {received_messages.map((message, i) => (
            <Message key={i} {...message} setMessages={setMessages} />
          ))}
        </Tab>
        <Tab eventKey="sent" tabClassName={styles.customTab} title="Sent">
          <Line />
          {sent_messages.length === 0 && (
            <Alert variant="light">You have no sent messages.</Alert>
          )}
          {sent_messages.map((message, i) => (
            <Message key={i} {...message} setMessages={setMessages} />
          ))}
        </Tab>
      </Tabs>
    </>
  );
};

export default Messages;
