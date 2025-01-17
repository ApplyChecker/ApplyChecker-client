import type { CommonApplication } from ".";

export interface WantedSyncState {
  inProgress: boolean;
  progress: number;
  existingCount: number;
  error?: string;
}

export interface WantedApiState {
  applications: CommonApplication[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  lastUpdated: string | null;
}

export interface ProgressMessage {
  type: "progress";
  current: number;
  total: number;
}

export interface PartialDataMessage {
  type: "partialData";
  data: CommonApplication[];
}

export type WantedMessage = ProgressMessage | PartialDataMessage;
