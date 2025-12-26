import React from "react";
import ReactDOM from "react-dom/client";
import Terminal from "./components/Terminal";
import "./index.css";

function App() {
  return (
    <div className="glass-container">
       {/* Future Tab Bar could go here */}
       <Terminal id="1" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
