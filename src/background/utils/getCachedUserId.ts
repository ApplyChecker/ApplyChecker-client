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
    return await extractAndCacheUserId();
  } catch (error) {
    console.error("캐시된 userId 가져오기 실패:", error);
    throw error;
  }
}

export default getCachedUserId;
