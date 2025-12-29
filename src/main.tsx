import React from "react";
import ReactDOM from "react-dom/client";
import Terminal from "./components/Terminal";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/Layout/AppLayout";
import "./index.css";

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Terminal id="1" />
      </AppLayout>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
