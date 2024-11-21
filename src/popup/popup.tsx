import React from "react";
import ReactDOM from "react-dom/client";
import useWantedApi from "./hooks/useWantedApi";
import { ApplicationList } from "./components/ApplicationList";
import "./popup.scss";

const App = () => {
  const { applications, isLoading, fetchApplications } = useWantedApi();

  const handleFetchClick = () => {
    void fetchApplications();
  };

  return (
    <div className="popup-container">
      <button
        onClick={handleFetchClick}
        disabled={isLoading}
        className="fetch-button"
      >
        {isLoading ? "로딩중..." : "지원 내역 가져오기"}
      </button>
      {applications.applications.length > 0 && (
        <ApplicationList applications={applications.applications} />
      )}
    </div>
  );
};

const container = document.createElement("div");
container.id = "root";
document.body.appendChild(container);
ReactDOM.createRoot(container as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
