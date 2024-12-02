import { RefreshCw, Loader } from "lucide-react";
import type { APIError } from "../../types/application";
import Progress from "../Progress/Progress";
import "./SyncButtons.scss";
import LoginError from "../LoginError/LoginError";

interface SyncState {
  isLoading: boolean;
  error: APIError | null;
  progress: number;
}

interface SyncButtonsProps {
  platforms: {
    wanted: SyncState;
    saramin: SyncState;
  };
  onSync: (platform?: "wanted" | "saramin") => Promise<void>;
}

const SyncButtons = ({ platforms, onSync }: SyncButtonsProps) => {
  const isAnySyncing =
    platforms.wanted.isLoading || platforms.saramin.isLoading;

  const handleRedirect = (url: string) => {
    chrome.tabs.create({ url, active: true });
  };

  const currentProgress = () => {
    if (platforms.wanted.isLoading) return platforms.wanted.progress;
    if (platforms.saramin.isLoading) return platforms.saramin.progress;
    return 0;
  };

  const getCurrentSyncingPlatform = () => {
    if (platforms.wanted.isLoading) return "wanted";
    if (platforms.saramin.isLoading) return "saramin";
    return null;
  };

  const isButtonDisabled = (buttonPlatform?: "wanted" | "saramin") => {
    const currentPlatform = getCurrentSyncingPlatform();

    if (!buttonPlatform) {
      return isAnySyncing;
    }
    return currentPlatform !== null && currentPlatform !== buttonPlatform;
  };

  return (
    <div className="sync-buttons">
      <button
        className="sync-buttons__all"
        onClick={() => {
          void onSync();
        }}
        disabled={isButtonDisabled()}
      >
        {isAnySyncing ? (
          <Loader className="sync-buttons__icon animate-spin" />
        ) : (
          <RefreshCw className="sync-buttons__icon" />
        )}
        전체 플랫폼 동기화
      </button>

      <div className="sync-buttons__grid">
        <button
          className="sync-buttons__platform sync-buttons__platform--wanted"
          onClick={() => {
            void onSync("wanted");
          }}
          disabled={isButtonDisabled("wanted")}
        >
          {platforms.wanted.isLoading ? (
            <Loader className="sync-buttons__icon animate-spin" />
          ) : (
            <RefreshCw className="sync-buttons__icon" />
          )}
          원티드
        </button>

        <button
          className="sync-buttons__platform sync-buttons__platform--saramin"
          onClick={() => {
            void onSync("saramin");
          }}
          disabled={isButtonDisabled("saramin")}
        >
          {platforms.saramin.isLoading ? (
            <Loader className="sync-buttons__icon animate-spin" />
          ) : (
            <RefreshCw className="sync-buttons__icon" />
          )}
          사람인
        </button>
      </div>

      {(isAnySyncing || platforms.wanted.error || platforms.saramin.error) && (
        <div className="sync-buttons__status">
          {isAnySyncing && (
            <>
              <div className="sync-buttons__status-message">
                <Loader className="sync-buttons__icon animate-spin" />
                데이터 동기화 중... {currentProgress()}%
              </div>
              <Progress
                value={currentProgress()}
                className="sync-buttons__progress"
              />
            </>
          )}
          {(platforms.wanted.error || platforms.saramin.error) && (
            <div className="sync-buttons__error">
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
      )}
    </div>
  );
};

export default SyncButtons;
