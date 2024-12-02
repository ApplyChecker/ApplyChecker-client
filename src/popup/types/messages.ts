import type { CommonApplication } from ".";

// types/messages.ts
export interface WantedSyncState {
  inProgress: boolean;
  progress: number;
  existingCount: number;
  error?: string;
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
