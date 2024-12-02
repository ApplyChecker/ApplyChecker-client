import formatDate from "../utils/formatDate";

async function saraminApi(): Promise<string> {
  const today: Date = new Date();
  const oneYearAgo: Date = new Date(today.setFullYear(today.getFullYear() - 1));

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

  if (html.includes("로그인이 필요한 페이지 입니다.")) {
    throw new Error("로그인이 필요한 기능입니다.");
  }

  return html;
}

export default saraminApi;
