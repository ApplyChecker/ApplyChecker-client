import getCachedUserId from "../utils/getCachedUserId";
import getCookieHeader from "../utils/getCookieHeader";

interface WantedErrorResponse {
  message: {
    error_code: number;
    message: string;
  };
}

const wantedApi = async (currentOffset: number) => {
  const cookieHeader: string = await getCookieHeader("wanted.co.kr");
  const userId = await getCachedUserId();
  const limit: number = 20;

  const url: string = `https://www.wanted.co.kr/api/v1/application
  s?${Date.now()}&status=complete,+pass,+hire,+reject&sort=-apply_time,-create_time&user_id=${userId}&end_date=&locale=ko-kr&includes=summary&q=&limit=${limit}&offset=${currentOffset}&start_date=`;

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
    const responseData: WantedErrorResponse = await response.json();

    if (responseData.message.error_code === 1002) {
      throw new Error(`로그인 후 이용 가능합니다.`);
    }

    throw new Error(responseData.message.message);
  }

  return await response.json();
};

export default wantedApi;
