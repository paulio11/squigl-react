import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const { handleLogout } = useAuth();
  handleLogout();
  return null;
};

export default Logout;
