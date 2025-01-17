import { useState, useEffect } from "react";
import type { ApplicationsState, CommonApplication } from "../types/index";
import type { APIError } from "../types/application";

export interface SaraminApplication {
  position: string;
  title: string;
  status: string;
}

interface UseSaraminApiReturn {
  applications: ApplicationsState;
  isLoading: boolean;
  error: APIError | null;
  progress: number;
  fetchApplications: () => Promise<void>;
}

function useSaraminApi(): UseSaraminApiReturn {
  const [applications, setApplications] = useState<ApplicationsState>({
    applications: [],
    lastUpdated: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<APIError | null>(null);

  // 저장된 데이터 로드
  useEffect(() => {
    const loadStoredData = async () => {
      const result = await chrome.storage.local.get([
        "saraminData",
        "saraminLastUpdated",
      ]);

      if (result.saraminData) {
        setApplications({
          applications: result.saraminData,
          lastUpdated: result.saraminLastUpdated,
        });
      }
    };

    void loadStoredData();
  }, []);

  // 데이터 가져오기
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "fetchSaraminData",
      });

      if (response.success) {
        const applyDatas: CommonApplication[] = response.data;
        const lastUpdateTime: string = new Date().toISOString();

        await chrome.storage.local.set({
          saraminData: applyDatas,
          saraminLastUpdated: lastUpdateTime,
        });

        setApplications({
          applications: applyDatas,
          lastUpdated: lastUpdateTime,
        });
      } else {
        throw new Error(response.error || "데이터를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류로 백그라운드 API 호출에 실패했습니다.";

      console.error("Saramin fetch error:", error);

      setError({
        type: "error",
        message: errorMessage,
        url: "https://www.saramin.co.kr/zf_user/auth",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    progress,
    fetchApplications,
  };
}

export default useSaraminApi;
