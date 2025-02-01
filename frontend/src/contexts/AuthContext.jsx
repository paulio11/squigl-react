import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendAPI } from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await backendAPI.get("/dj-rest-auth/user/");
      setUser(data);
    } catch (error) {
      if (error.response?.status === 401) {
        refreshAccessToken();
      }
    } finally {
      setUserLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      await backendAPI.post("/dj-rest-auth/token/refresh/");
      fetchUser();
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await backendAPI.post("/dj-rest-auth/login/", loginData);
      if (response.status === 200) {
        await fetchUser();
        nav("/feed");
      }
    } catch (error) {
      return error.response?.data;
    }
  };

  const handleLogout = async () => {
    try {
      await backendAPI.post("/dj-rest-auth/logout/");
      setUser(null);
      nav("/login");
    } catch (error) {
      console.error("Logout failed.", error);
    }
  };

  const contextValue = {
    user,
    setUser,
    userLoading,
    setUserLoading,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
