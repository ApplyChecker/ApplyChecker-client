import type { WantedSyncState } from "../popup/types/messages";
import type { CommonApplication } from "../popup/types/index";

import parseSaraminHtml from "./utils/parseSaraminHtml";
import transformApplication from "./utils/transformApplication";
import checkUpdateCooldown from "./utils/checkUpdateCooldown";

import wantedApi from "./apis/wantedApi";
import saraminApi from "./apis/saraminApi";

interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface WantedApplication {
  id: number;
  status: string;
  status_reward: string;
  company_id: number;
  job: {
    id: number;
    company_name: string;
    position: string;
    location: string;
    formatted_reward_total: string;
    category: string;
  };
  create_time: string;
}

interface ChromeMessage {
  action: "fetchWantedData" | "fetchSaraminData";
}

chrome.runtime.onMessage.addListener(
  (
    request: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void,
  ): boolean => {
    if (request.action === "fetchWantedData") {
      (async () => {
        try {
          const cooldown = await checkUpdateCooldown("wanted");

          console.log("cooldown", cooldown);
          if (!cooldown.canUpdate) {
            sendResponse({ success: false, error: cooldown.message });
            return;
          }

          fetchWantedData()
            .then((data) => {
              sendResponse({ success: true, data });
            })
            .catch((error: Error) => {
              sendResponse({ success: false, error: error.message });
            });
        } catch (error) {
          sendResponse({
            success: false,
            error: "예기치 않은 오류가 발생했습니다.",
          });
        }
      })();

      return true;
    }

    if (request.action === "fetchSaraminData") {
      (async () => {
        try {
          const cooldown = await checkUpdateCooldown("saramin");

          console.log("cooldown", cooldown);
          if (!cooldown.canUpdate) {
            sendResponse({ success: false, error: cooldown.message });
            return;
          }

          fetchSaraminData()
            .then((data) => {
              sendResponse({ success: true, data });
            })
            .catch((error: Error) => {
              sendResponse({ success: false, error: error.message });
            });
        } catch (error) {
          sendResponse({
            success: false,
            error: "예기치 않은 오류가 발생했습니다.",
          });
        }
      })();

      return true;
    }

    return false;
  },
);

async function fetchWantedData(): Promise<CommonApplication[]> {
  let currentApplications: WantedApplication[] = [];

  const updateSyncState = async (state: Partial<WantedSyncState>) => {
    await chrome.storage.local.set({
      wantedSyncState: {
        inProgress: false,
        progress: 0,
        existingCount: currentApplications.length,
        ...state,
      },
    });
  };

  try {
    const limit: number = 20;
    let hasMore: boolean = true;

    const stored = await chrome.storage.local.get(["wantedData"]);
    if (stored.wantedData) currentApplications = stored.wantedData;

    const saveAndNotifyProgress = async (
      applications: WantedApplication[],
      current: number,
      total: number,
    ) => {
      const transformed = applications.map(transformApplication);

      await chrome.storage.local.set({
        wantedData: transformed,
        wantedLastUpdated: new Date().toISOString(),
        wantedSyncState: {
          inProgress: true,
          progress: Math.floor((current / total) * 100),
          existingCount: transformed.length,
        },
      });

      chrome.runtime.sendMessage({
        type: "progress",
        current,
        total,
      });

      chrome.runtime.sendMessage({
        type: "partialData",
        data: transformed,
      });

      return transformed;
    };

    const initialResponse = await wantedApi(0);
    const totalApplications = initialResponse.summary.active;

    if (currentApplications.length === 0) {
      currentApplications = initialResponse.applications || [];

      await saveAndNotifyProgress(
        currentApplications,
        currentApplications.length,
        totalApplications,
      );
    }

    let offset = Math.max(currentApplications.length, limit);

    if (currentApplications.length >= totalApplications) {
      hasMore = false;

      throw new Error("이미 최신 데이터입니다.");
    }

    while (hasMore) {
      try {
        const pageResponse = await wantedApi(offset);

        if (
          !pageResponse.applications ||
          pageResponse.applications.length === 0
        ) {
          break;
        }

        currentApplications = currentApplications.concat(
          pageResponse.applications,
        );

        await saveAndNotifyProgress(
          currentApplications,
          currentApplications.length,
          totalApplications,
        );

        if (pageResponse.applications.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } catch (error) {
        console.error(`${offset} 번째 데이터를 호출에서 에러가 발생함:`, error);
        hasMore = false;
        throw error;
      }
    }

    const finalTransformed = currentApplications.map(transformApplication);

    await chrome.storage.local.set({
      wantedData: finalTransformed,
      wantedLastUpdated: new Date().toISOString(),
      wantedSyncState: {
        inProgress: false,
        progress: 100,
        existingCount: finalTransformed.length,
      },
    });

    return finalTransformed;
  } catch (error) {
    const errorMessage = (error as Error).message;

    const isLoginError = errorMessage.includes("로그인 후 이용 가능합니다");

    await updateSyncState({
      inProgress: false,
      error: isLoginError ? "로그인이 필요합니다." : errorMessage,
    });

    throw new Error(`원티드 에러: ${(error as Error).message}`);
  }
}

async function fetchSaraminData(): Promise<CommonApplication[]> {
  try {
    const html = await saraminApi();
    const result = parseSaraminHtml(html);

    return result;
  } catch (error) {
    console.error("Saramin error:", error);
    throw new Error((error as Error).message);
  }
}
