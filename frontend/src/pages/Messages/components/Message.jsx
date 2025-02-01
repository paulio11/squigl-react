import React from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Message.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/axiosConfig";

const Message = (props) => {
  const { sender, recipient, read, message, date, id, setMessages } = props;
  const { user, setUser } = useAuth();
  const nav = useNavigate();

  const handleMarkRead = async () => {
    try {
      const { status } = await backendAPI.patch(`/messages/${id}`, {
        read: !read,
      });

      if (status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          unread_messages: !read
            ? prevUser.unread_messages - 1
            : prevUser.unread_messages + 1,
        }));

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === id ? { ...msg, read: !read } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!userConfirmed) return;

    try {
      const isSender = user.username === sender;
      const deleteField = isSender ? "sender_del" : "recipient_del";

      const { status } = await backendAPI.patch(`/messages/${id}`, {
        [deleteField]: true,
      });

      if (status === 200 || status === 204) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== id)
        );
        if (!read && !isSender) {
          setUser((prevUser) => ({
            ...prevUser,
            unread_messages: prevUser.unread_messages - 1,
          }));
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const sender_footer = (
    <div className={styles.footer}>
      {read ? (
        <div>
          <i className="fa-solid fa-envelope-open"></i> Read by @{recipient}
        </div>
      ) : (
        <div>
          <i className="fa-solid fa-envelope"></i> Unread
        </div>
      )}
      <div className={styles.clickable} onClick={handleDelete}>
        <i className="fa-solid fa-trash"></i> Delete
      </div>
    </div>
  );

  const recipient_footer = (
    <div className={styles.footer}>
      {read ? (
        <div onClick={handleMarkRead} className={styles.clickable}>
          <i className="fa-solid fa-envelope-open"></i> Read
        </div>
      ) : (
        <div onClick={handleMarkRead} className={styles.clickable}>
          <i className="fa-solid fa-envelope"></i> Mark as read
        </div>
      )}
      <div>
        <div className={styles.clickable} onClick={handleDelete}>
          <i className="fa-solid fa-trash"></i> Delete
        </div>
        <div
          className={styles.clickable}
          onClick={() => nav(`/messages/send/${sender}`)}
        >
          <i className="fa-solid fa-reply"></i> Reply
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <div className={styles.header}>
          {user.username === sender ? (
            <>
              To:{" "}
              <Link to={`/u/${recipient}`} className="usertag">
                @{recipient}
              </Link>
            </>
          ) : (
            <>
              From:{" "}
              <Link to={`/u/${sender}`} className="usertag">
                @{sender}
              </Link>
            </>
          )}{" "}
          · <span className="text-muted">{date}</span>
        </div>
        <div className={styles.messageText}>{message}</div>
      </div>
      {user.username === sender ? sender_footer : recipient_footer}
    </div>
  );
};

export default Message;
