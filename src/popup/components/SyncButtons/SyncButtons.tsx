import { useState } from "react";
import { RefreshCw, Loader } from "lucide-react";

import type { APIError } from "../../types/application";

import Progress from "../Progress/Progress";
import LoginError from "../LoginError/LoginError";

import "./SyncButtons.scss";

interface SyncState {
  isLoading: boolean;
  error: APIError | null;
  progress: number;
  lastSyncDate?: string;
}

interface PlatformInfo {
  id: "wanted" | "saramin";
  name: string;
  state: SyncState;
}

interface SyncButtonsProps {
  platforms: {
    wanted: SyncState;
    saramin: SyncState;
  };
  onSync: (platform?: "wanted" | "saramin") => Promise<void>;
}

const SyncButtons = ({ platforms, onSync }: SyncButtonsProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    ("wanted" | "saramin")[]
  >([]);

  const platformList: PlatformInfo[] = [
    { id: "wanted", name: "원티드", state: platforms.wanted },
    { id: "saramin", name: "사람인", state: platforms.saramin },
  ];

  const isAnySyncing = platformList.some(
    (platform) => platform.state.isLoading,
  );

  const handleRedirect = (url: string) => {
    chrome.tabs.create({ url, active: true });
  };

  const currentProgress = () => {
    const syncingPlatform = platformList.find(
      (platform) => platform.state.isLoading,
    );
    return syncingPlatform?.state.progress ?? 0;
  };

  const handlePlatformSelect = (platformId: "wanted" | "saramin") => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId],
    );
  };

  const formatLastSync = (date?: string) => {
    if (!date) return "동기화 이력 없음";

    const updateDate = new Date(date);
    const month = String(updateDate.getMonth() + 1).padStart(2, "0");
    const day = String(updateDate.getDate()).padStart(2, "0");
    const hours = String(updateDate.getHours()).padStart(2, "0");
    const minutes = String(updateDate.getMinutes()).padStart(2, "0");

    return `최근 업데이트: ${month}.${day} ${hours}:${minutes}`;
  };

  const handleSync = () => {
    if (selectedPlatforms.length === 0) return;
    if (selectedPlatforms.length === platformList.length) {
      void onSync();
    } else {
      void onSync(selectedPlatforms[0]);
    }
  };

  return (
    <div className="platform-select">
      <h2 className="platform-select__title">동기화할 플랫폼 선택</h2>

      <div className="platform-select__list">
        {platformList.map((platform: PlatformInfo) => (
          <label key={platform.id} className="platform-select__item">
            <div className="platform-select__content">
              <div className="platform-select__main">
                <input
                  type="checkbox"
                  className={`platform-select__checkbox platform-select__checkbox--${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onChange={() => {
                    handlePlatformSelect(platform.id);
                  }}
                  disabled={isAnySyncing}
                />
                <span className="platform-select__label">{platform.name}</span>
              </div>
              <div className="platform-select__info">
                <span className="platform-select__date">
                  {formatLastSync(platform.state.lastSyncDate)}
                </span>
                {platform.state.isLoading && (
                  <Loader className="platform-select__icon animate-spin" />
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      <button
        className="platform-select__sync-button"
        onClick={handleSync}
        disabled={selectedPlatforms.length === 0 || isAnySyncing}
      >
        {isAnySyncing ? (
          <Loader className="platform-select__icon animate-spin" />
        ) : (
          <RefreshCw className="platform-select__icon" />
        )}
        선택한 플랫폼 동기화
      </button>

      {(isAnySyncing || Object.values(platforms).some((p) => p.error)) && (
        <div className="platform-select__status">
          {isAnySyncing && (
            <>
              <div className="platform-select__status-message">
                <Loader className="platform-select__icon animate-spin" />
                데이터 동기화 중... {currentProgress()}%
              </div>
              <Progress
                value={currentProgress()}
                className="platform-select__progress"
              />
            </>
          )}
          {Object.entries(platforms).map(
            ([platform, state]) =>
              state.error && (
                <LoginError
                  key={platform}
                  error={state.error}
                  onRedirect={handleRedirect}
                />
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default SyncButtons;
