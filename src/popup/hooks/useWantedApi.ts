// hooks/useWantedApi.ts
import { useState, useEffect } from "react";
import type { APIError } from "../types/application";
import type {
  ApplicationsState,
  ChromeMessage,
  CommonApplication,
  MessageResponse,
} from "../types";

interface ProgressMessage {
  type: "progress";
  current: number;
  total: number;
}

interface PartialDataMessage {
  type: "partialData";
  data: CommonApplication[];
}

type WantedMessage = ProgressMessage | PartialDataMessage;

interface UseWantedApiReturn {
  applications: ApplicationsState;
  isLoading: boolean;
  error: APIError | null;
  progress: number;
  setApplications: React.Dispatch<React.SetStateAction<ApplicationsState>>;
  fetchApplications: () => Promise<void>;
}

function useWantedApi(): UseWantedApiReturn {
  const [applications, setApplications] = useState<ApplicationsState>({
    applications: [],
    lastUpdated: "",
  });
  const [error, setError] = useState<APIError | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 로드시 스토리지에서 동기화 상태를 조회
  useEffect(() => {
    const loadStoredData = async () => {
      const stored = await chrome.storage.local.get([
        "wantedData",
        "wantedLastUpdated",
        "wantedSyncState",
      ]);

      if (!stored.wantedData) return;

      setApplications({
        applications: stored.wantedData,
        lastUpdated: stored.wantedLastUpdated,
      });

      if (stored.wantedSyncState?.inProgress) {
        setIsLoading(true);
        setProgress(stored.wantedSyncState.progress);
      }
    };

    void loadStoredData();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    const messageListener = (
      message: WantedMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void,
    ) => {
      if (message.type === "progress") {
        const percentage = Math.floor((message.current / message.total) * 100);
        setProgress(percentage);
      } else if (message.type === "partialData") {
        setApplications({
          applications: message.data,
          lastUpdated: new Date().toISOString(),
        });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    try {
      const response = await chrome.runtime.sendMessage<
        ChromeMessage,
        MessageResponse
      >({
        action: "fetchWantedData",
      });

      if (!response.success) {
        if (response.error?.includes("로그인이 필요합니다.")) {
          setError({
            type: "login",
            message: response.error,
            url: "https://www.wanted.co.kr/login",
          });
        } else {
          setError({
            type: "error",
            message: response.error || "알 수 없는 에러가 발생했습니다.",
          });
        }

        throw new Error(response.error || "알 수 없는 에러가 발생했습니다.");
      }

      const lastUpdateTime: string = new Date().toISOString();

      setApplications({
        applications: response.data || [],
        lastUpdated: lastUpdateTime,
      });
    } catch (error) {
      console.error("useWantedApi error:", error);
    } finally {
      chrome.runtime.onMessage.removeListener(messageListener);
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    progress,
    setApplications,
    fetchApplications,
  };
}

export default useWantedApi;
