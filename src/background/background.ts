// Types and Interfaces
interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface WantedApplication {
  id: number;
  status: string;
  job: {
    company_name: string;
    position: string;
    location: string;
    formatted_reward_total: string;
    category: string;
  };
  create_time: string;
}

interface ProcessedWantedApplication {
  id: number;
  status: string;
  companyName: string;
  position: string;
  appliedDate: string;
  location: string;
  jobDetail: {
    reward: string;
    category: string;
  };
}

interface ChromeMessage {
  action: "fetchWantedData" | "fetchSaraminData";
}

// 메시지 핸들러 - 각 플랫폼별 액션 처리
chrome.runtime.onMessage.addListener(
  (
    request: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void,
  ): boolean => {
    if (request.action === "fetchWantedData") {
      fetchWantedData()
        .then((data) => {
          sendResponse({ success: true, data });
        })
        .catch((error: Error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 비동기 응답을 위해 필요
    }

    if (request.action === "fetchSaraminData") {
      fetchSaraminData()
        .then((data) => {
          sendResponse({ success: true, data });
        })
        .catch((error: Error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 비동기 응답을 위해 필요
    }

    return false;
  },
);

// localStorage에서 userId를 추출하고 캐싱하는 함수
async function extractAndCacheUserId(): Promise<string> {
  try {
    // 먼저 캐시된 userId가 있는지 확인
    const cached = await chrome.storage.local.get("cached_wanted_user_id");
    if (cached.cached_wanted_user_id) {
      return cached.cached_wanted_user_id;
    }

    // 캐시가 없으면 wanted.co.kr 탭을 찾아서 userId 추출
    const result = await chrome.tabs.query({ url: "https://*.wanted.co.kr/*" });
    const tabId = result[0]?.id;

    if (!tabId) {
      throw new Error("Wanted 페이지를 열어주세요.");
    }

    const response = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const userIdKey = Object.keys(localStorage).find((key) =>
          key.startsWith("ab.storage.userId"),
        );

        if (!userIdKey) {
          return null;
        }

        const userData = localStorage.getItem(userIdKey);
        if (!userData) {
          return null;
        }

        try {
          const parsed = JSON.parse(userData);
          return parsed.v.g;
        } catch {
          return null;
        }
      },
    });

    const userId = response[0]?.result;

    if (!userId) {
      throw new Error(
        "userId를 찾을 수 없습니다. Wanted에 로그인되어 있는지 확인해주세요.",
      );
    }

    // userId를 캐시에 저장
    await chrome.storage.local.set({
      cached_wanted_user_id: userId,
      cached_wanted_user_id_timestamp: Date.now(), // 캐시 시간도 저장
    });

    return userId;
  } catch (error) {
    console.error("userId 추출 에러:", error);
    throw error;
  }
}

// 캐시된 userId를 가져오거나 없으면 새로 추출하는 함수
async function getCachedUserId(): Promise<string> {
  try {
    const cached = await chrome.storage.local.get([
      "cached_wanted_user_id",
      "cached_wanted_user_id_timestamp",
    ]);

    // 캐시가 있고, 24시간이 지나지 않았다면 캐시된 값 사용
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

    if (
      cached.cached_wanted_user_id &&
      cached.cached_wanted_user_id_timestamp &&
      Date.now() - cached.cached_wanted_user_id_timestamp < CACHE_DURATION
    ) {
      return cached.cached_wanted_user_id;
    }

    // 캐시가 없거나 만료되었으면 새로 추출
    return extractAndCacheUserId();
  } catch (error) {
    console.error("캐시된 userId 가져오기 실패:", error);
    throw error;
  }
}

// 원티드 데이터 가져오기
async function fetchWantedData(): Promise<ProcessedWantedApplication[]> {
  try {
    const timestamp: number = Date.now();
    let allApplications: WantedApplication[] = [];
    let offset: number = 0;
    const limit: number = 20;
    let hasMore: boolean = true;
    const cookieHeader: string = await getCookieHeader("wanted.co.kr");
    const userId = await getCachedUserId();

    console.log("userId", userId);

    while (hasMore) {
      const url: string = `https://www.wanted.co.kr/api/v1/applications?${timestamp}&status=complete,+pass,+hire,+reject&sort=-apply_time,-create_time&user_id=${userId}&end_date=&locale=ko-kr&includes=summary&q=&limit=${limit}&offset=${offset}&start_date=`;

      const response: Response = await fetch(url, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "wanted-user-agent": "user-web",
          "wanted-user-country": "KR",
          "wanted-user-language": "ko",
          cookie: cookieHeader,
          Referer:
            "https://www.wanted.co.kr/status/applications/applied?q&start_date=&end_date=",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`원티드 API 요청 실패 (${response.status})`);
      }

      const data: { applications: WantedApplication[] } = await response.json();
      if (!data.applications || data.applications.length === 0) break;
      console.log("data", data);
      allApplications = allApplications.concat(data.applications);

      if (data.applications.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return allApplications.map((app) => ({
      id: app.id,
      status: app.status,
      companyName: app.job.company_name,
      position: app.job.position,
      appliedDate: new Date(app.create_time).toLocaleDateString("ko-KR"),
      location: app.job.location,
      jobDetail: {
        reward: app.job.formatted_reward_total,
        category: app.job.category,
      },
    }));
  } catch (error) {
    console.error("Wanted error:", error);
    throw new Error(`원티드 데이터 가져오기 실패: ${(error as Error).message}`);
  }
}

// 사람인 데이터 가져오기
async function fetchSaraminData(): Promise<string> {
  try {
    const cookieHeader: string = await getCookieHeader("saramin.co.kr");
    const today: Date = new Date();
    const oneYearAgo: Date = new Date(
      today.setFullYear(today.getFullYear() - 1),
    );

    const url: string = `https://www.saramin.co.kr/zf_user/persons/apply-status-list?status_type=&start_date=${formatDate(
      oneYearAgo,
    )}&end_date=${formatDate(
      new Date(),
    )}&search_period=12&read_status=tot&recruit_status=tot&order_type=update&keyword=`;

    const response: Response = await fetch(url, {
      method: "GET",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`사람인 API 요청 실패 (${response.status})`);
    }

    const html: string = await response.text();
    console.log(html);
    return html;
  } catch (error) {
    console.error("Saramin error:", error);
    throw new Error(`사람인 데이터 가져오기 실패: ${(error as Error).message}`);
  }
}

// 도메인별 쿠키 가져오기
async function getCookieHeader(domain: string): Promise<string> {
  const cookies: chrome.cookies.Cookie[] = await chrome.cookies.getAll({
    domain: `.${domain}`,
  });
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

// 날짜 포맷팅 함수
function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
