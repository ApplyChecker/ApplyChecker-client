// types/index.ts

export interface MessageResponse {
  success: boolean;
  data?: ProcessedWantedApplication[];
  error?: string;
}

export interface WantedApplication {
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

export interface ProcessedWantedApplication {
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

export interface ApplicationsState {
  applications: ProcessedWantedApplication[];
  lastUpdated?: string;
}

export interface ChromeMessage {
  action: "fetchWantedData" | "fetchSaraminData";
}
