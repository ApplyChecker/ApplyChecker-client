import React from "react";
import ReactDOM from "react-dom/client";
import useWantedApi from "./hooks/useWantedApi";
import { ApplicationList } from "./components/ApplicationList";
import type {
  ChromeMessage,
  MessageResponse,
  ApplicationsState,
} from "./types";
import "./popup.scss";
import { useSaraminApi } from "./hooks/useSaramInApi";

const App: React.FC = () => {
  const { applications, isLoading, setApplications } = useWantedApi();
  const {
    applications: saramInData,
    isLoading: isSaramInLoading,
    fetchApplications,
  } = useSaraminApi();
  const [error, setError] = React.useState<string | null>(null);

  const handleFetchClick = async () => {
    try {
      const response = await chrome.runtime.sendMessage<
        ChromeMessage,
        MessageResponse
      >({
        action: "fetchWantedData",
      });

      if (response.success && response.data) {
        const newState: ApplicationsState = {
          applications: response.data,
          lastUpdated: new Date().toISOString(),
        };

        await chrome.storage.local.set({
          wantedData: response.data,
          wantedLastUpdated: newState.lastUpdated,
        });

        setApplications(newState);
        setError(null);
      } else {
        throw new Error(response.error || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error fetching applications:", error);
    }
  };

  const handleFetchSaramIn = async () => {};

  return (
    <div className="popup-container">
      <button
        onClick={handleFetchClick}
        disabled={isLoading}
        className="fetch-button"
      >
        {isLoading ? "로딩중..." : "지원 내역 가져오기"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {applications.applications && applications.applications.length > 0 ? (
        <ApplicationList applications={applications.applications} />
      ) : (
        <div className="no-data">지원 내역이 없습니다.</div>
      )}

      <button
        onClick={fetchApplications}
        disabled={isSaramInLoading}
        className="fetch-button"
      >
        {isLoading ? "로딩중..." : "지원 내역 가져오기"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {saramInData.applications.length > 0 ? (
        <div className="applications-list">
          {saramInData.applications.map((app, index) => (
            <div key={index} className="application-item">
              <h3>{app.title}</h3>
              <p>직무: {app.position}</p>
              <p>상태: {app.status}</p>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <div className="no-data">지원 내역이 없습니다.</div>
      )}
    </div>
  );
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
