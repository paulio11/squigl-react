import React, { useEffect, useState } from "react";

import Title from "../Misc/Title";
import { backendAPI } from "../../api/axiosConfig";
import UserToFollow from "./components/UserToFollow";

const WhoToFollow = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const { data } = await backendAPI.get("/profiles/tofollow/");
        setUsers(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return;
  }

  return (
    <div className="mt-5">
      <Title title="Discover users" />
      {users?.map((user, i) => (
        <UserToFollow key={i} {...user} />
      ))}
    </div>
  );
};

export default WhoToFollow;
