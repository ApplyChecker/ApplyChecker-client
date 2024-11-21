import Cookies from "js-cookie";

export function getWantedCookies(): Record<string, string> {
  const cookies = Cookies.get() as Record<string, string>;

  // 필요한 쿠키 목록 정의
  const requiredCookies = [
    "_fwb",
    "_fbp",
    "ab180ClientId",
    "airbridge_device_alias",
    "_ga",
    "_gcl_au",
    "is_terms",
    "WWW_ONEID_ACCESS_TOKEN",
    "AMP_MKTG_d08dcdfb83",
    "AMP_d08dcdfb83",
    "_gcl_aw",
    "_gcl_gs",
    "airbridge_utm",
    "airbridge_utm_url",
    "airbridge_utm_timestamp",
    "airbridge_user",
    "ab.storage.deviceId",
    "ab.storage.userId",
    "ab.storage.sessionId",
    "utm",
    "__rtbh.uid",
    "__rtbh.lid",
    "wcs_bt",
    "_ga_JMVHE9R721",
    "AWSALBTG",
    "AWSALBTGCORS",
    "airbridge_session",
    "_dd_s",
  ];

  // 필요한 쿠키만 필터링
  const wantedCookies: Record<string, string> = Object.keys(cookies)
    .filter((key) =>
      requiredCookies.some((required) => key.startsWith(required)),
    )
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = cookies[key];
      return acc;
    }, {});

  return wantedCookies;
}

export function buildRequestHeaders(): Record<string, string> {
  const wantedCookies = getWantedCookies();

  return {
    "content-type": "application/json",
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    cookie: Object.entries(wantedCookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
    priority: "u=1, i",
    referer:
      "https://www.wanted.co.kr/status/applications/applied?status=complete&q&start_date=&end_date=",
    "sec-ch-ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "wanted-user-agent": "user-web",
    "wanted-user-country": "KR",
    "wanted-user-language": "ko",
  };
}
