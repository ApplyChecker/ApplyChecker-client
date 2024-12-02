import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/popup.scss";
import JobList from "./components/JobList/JobList";

const App: React.FC = () => {
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
