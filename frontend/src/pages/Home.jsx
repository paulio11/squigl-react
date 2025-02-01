import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      nav("/feed");
    } else {
      nav("/login");
    }
  }, [user]);

  return null;
};

export default Home;
