import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";
import React from "react";
import { AppProvider } from "./utils/AppProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
