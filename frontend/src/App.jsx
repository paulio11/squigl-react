import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";

import { useAuth } from "./contexts/AuthContext";
import { setBackendAvailabilityCallback } from "./api/axiosConfig";
import HeaderRow from "./components/HeaderRow/HeaderRow";
import ContentRow from "./components/ContentRow/ContentRow";
import Line from "./components/Line/Line";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import NetworkError from "./pages/Error/NetworkError";

function App() {
  const { userLoading } = useAuth();
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    setBackendAvailabilityCallback(setBackendAvailable);
  }, []);

  if (userLoading) {
    return;
  }

  if (!backendAvailable) {
    return (
      <Container>
        <NetworkError />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollToTop />
      <HeaderRow />
      <Line />
      <ContentRow />
    </Container>
  );
}

export default App;
