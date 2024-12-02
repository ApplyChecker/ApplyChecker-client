import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles/popup.scss";
import JobList from "./components/JobList/JobList";

const App: React.FC = () => {
  const testBackground = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: "ping" });
      console.log("Background response:", response); // { message: 'pong' }이 출력되어야 함
    } catch (error) {
      console.error("Background test failed:", error);
    }
  };

  useEffect(() => {
    void testBackground();
  }, []);

  return <JobList />;
};

const container = document.createElement("div");
container.id = "root";
document.body.appendChild(container);

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export default App;
