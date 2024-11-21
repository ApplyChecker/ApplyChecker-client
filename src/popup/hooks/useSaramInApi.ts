// hooks/useSaraminApi.ts

import { useState, useEffect } from "react";

export interface SaraminApplication {
  position: string;
  title: string;
  status: string;
}

interface SaraminState {
  applications: SaraminApplication[];
  lastUpdated?: string;
}

interface UseSaraminApiReturn {
  applications: SaraminState;
  isLoading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
}

export function useSaraminApi(): UseSaraminApiReturn {
  const [applications, setApplications] = useState<SaraminState>({
    applications: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 저장된 데이터 로드
  useEffect(() => {
    const loadStoredData = async () => {
      const result = await chrome.storage.local.get([
        "saraminData",
        "saraminLastUpdated",
      ]);

      if (result.saraminData) {
        const parsedApplications = parseSaraminHtml(result.saraminData);
        setApplications({
          applications: parsedApplications,
          lastUpdated: result.saraminLastUpdated,
        });
      }
    };

    void loadStoredData();
  }, []);

  // HTML 파싱 함수
  const parseSaraminHtml = (html: string): SaraminApplication[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const applications: SaraminApplication[] = [];

    const applicationRows = doc.querySelectorAll(".row._apply_list");

    applicationRows.forEach((row) => {
      const application: SaraminApplication = {
        position: "",
        title: "",
        status: "",
      };

      const divisionElement = row.querySelector(".division");
      if (divisionElement) {
        application.position = divisionElement.textContent?.trim() || "";
      }

      const titleElement = row.querySelector(".TipBox > span:not(.Tail)");
      if (titleElement) {
        application.title = titleElement.textContent?.trim() || "";
      }

      const statusElement = row.querySelector(".corp>a");
      if (statusElement) {
        application.status = statusElement.textContent?.trim() || "";
      }

      applications.push(application);
    });

    return applications;
  };

  // 데이터 가져오기
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "fetchSaraminData",
      });

      if (response.success) {
        const parsedApplications = parseSaraminHtml(response.data);
        const newState: SaraminState = {
          applications: parsedApplications,
          lastUpdated: new Date().toISOString(),
        };

        // 스토리지 저장
        await chrome.storage.local.set({
          saraminData: response.data,
          saraminLastUpdated: newState.lastUpdated,
        });

        setApplications(newState);
      } else {
        throw new Error(response.error || "데이터를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Saramin fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    fetchApplications,
  };
}
