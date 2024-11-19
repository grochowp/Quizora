import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";
import React from "react";
import { LoggedUserProvider } from "./contexts/loggedUserContext.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoggedUserProvider>
        <App />
      </LoggedUserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
