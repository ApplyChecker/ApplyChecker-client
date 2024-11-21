// hooks/useWantedApi.ts
import { useState, useEffect } from "react";
import type {
  ApplicationsState,
  ChromeMessage,
  MessageResponse,
} from "../types";

interface UseWantedApiReturn {
  applications: ApplicationsState;
  isLoading: boolean;
  setApplications: React.Dispatch<React.SetStateAction<ApplicationsState>>;
  fetchApplications: () => Promise<void>;
}

export default function useWantedApi(): UseWantedApiReturn {
  const [applications, setApplications] = useState<ApplicationsState>({
    applications: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      const result = await chrome.storage.local.get([
        "wantedData",
        "wantedLastUpdated",
      ]);

      if (result.wantedData) {
        setApplications({
          applications: result.wantedData,
          lastUpdated: result.wantedLastUpdated,
        });
      }
    };

    void loadStoredData();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await chrome.runtime.sendMessage<
        ChromeMessage,
        MessageResponse
      >({
        action: "fetchWantedData",
      });

      if (response.success && response.data) {
        setApplications({
          applications: response.data,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        throw new Error(response.error || "데이터를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    setApplications,
    fetchApplications,
  };
}
