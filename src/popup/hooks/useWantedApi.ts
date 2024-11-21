import { useState, useEffect } from "react";
import { buildRequestHeaders } from "../utils/wantedApi";
import type { ApiResponse } from "../types/application";
import mockData from "../utils/mockData";

const API_ENDPOINT = "https://www.wanted.co.kr/api/v1/applications";

const useWantedApi = () => {
  const [applications, setApplications] = useState<ApiResponse>({
    applications: [],
    total: 0,
    summary: {
      hire: 0,
      complete: 0,
      pass: 0,
      accept: 0,
      write: 0,
      reject: 0,
      active: 0,
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = async (params = {}) => {
    try {
      setIsLoading(true);

      // 로컬 스토리지에서 user_id 값 가져오기
      const userIdKeyPrefix = "ab.storage.userId.";
      const userIdDataString = Object.keys(localStorage)
        .find((key) => key.startsWith(userIdKeyPrefix))
        ?.trim();
      const userIdData = userIdDataString
        ? JSON.parse(userIdDataString)
        : undefined;
      const userId = userIdData?.g || "";

      const queryParams = new URLSearchParams({
        user_id: userId,
        status: "complete,pass,hire,reject",
        sort: "-apply_time,-create_time",
        limit: "20",
        offset: "20",
        locale: "ko-kr",
        includes: "summary",
        q: "",
        start_date: "",
        end_date: "",
        ...params,
      }).toString();

      const headers = buildRequestHeaders();

      console.log("result", `${API_ENDPOINT}?${queryParams}`, {
        headers,
      });

      // const response = await fetch(`${API_ENDPOINT}?${queryParams}`, {
      //   headers,
      // });

      // if (!response.ok) {
      //   throw new Error(
      //     `API request failed with status code ${response.status}`,
      //   );
      // }

      // const data = await response.json();
      // setApplications(data);

      setApplications(mockData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { applications, isLoading, error, fetchApplications };
};

export default useWantedApi;
