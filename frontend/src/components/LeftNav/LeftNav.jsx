import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";

import styles from "./LeftNav.module.css";
import { useAuth } from "../../contexts/AuthContext";

function LeftNav() {
  const { user } = useAuth();
  const location = useLocation();

  const user_links = [
    { icon: "comments", path: "/feed", label: "Feed" },
    { icon: "user", path: `/u/${user?.username}`, label: "Profile" },
    { icon: "pen-to-square", path: "/new_post", label: "New post" },
    {
      icon: "envelope",
      path: "/messages/unread",
      label: "Messages",
      count: user?.unread_messages || null,
    },
    { icon: "gear", path: "/settings", label: "Settings" },
    { icon: "right-from-bracket", path: "/logout", label: "Logout" },
  ];

  const no_user_links = [
    { icon: "right-to-bracket", path: "/login", label: "Login" },
    { icon: "user-plus", path: "/register", label: "Register" },
  ];

  const [navLinks, setNavLinks] = useState(no_user_links);

  useEffect(() => {
    setNavLinks(user ? user_links : no_user_links);
  }, [user]);

  // Determine the active tab considering messages paths
  const activeTab = navLinks.some((link) => link.path === location.pathname)
    ? location.pathname
    : location.pathname.startsWith("/messages/")
    ? "/messages/unread" // Active message tab group
    : null;

  return (
    <Nav variant="pills" className="flex-column">
      {navLinks?.map((link) => (
        <Nav.Link
          className={`${styles.navLink} ${
            activeTab === link.path ? styles.activePill : styles.pill
          }`}
          key={link.path}
          as={Link}
          to={link.path}
        >
          <div>
            <i className={`fa-solid fa-${link.icon} ${styles.navIcon}`}></i>{" "}
            {link.label}
          </div>
          {link.count && (
            <Badge
              className={`${
                activeTab === link.path
                  ? styles.navBadgeActive
                  : styles.navBadge
              }`}
            >
              {link.count}
            </Badge>
          )}
        </Nav.Link>
      ))}
    </Nav>
  );
}

export default LeftNav;
