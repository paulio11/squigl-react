import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AuthProvider>
  </BrowserRouter>
);
