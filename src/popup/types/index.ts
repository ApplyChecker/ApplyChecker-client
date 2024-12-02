export interface MessageResponse {
  success: boolean;
  data?: CommonApplication[];
  error?: string;
}

export interface ChromeMessage {
  action: "fetchWantedData" | "fetchSaraminData";
}

export interface CommonApplication {
  companyName: string;
  position: string;
  positionTitle: string;
  appliedDate: string;

  status: {
    main: string;
    sub?: string;
  };

  company: {
    name: string;
    id?: string;
  };

  recruitment: {
    id: string;
    location?: string;
  };

  application: {
    id: string;
  };

  meta: {
    platform: "wanted" | "saramin";
    lastUpdated: string;
    url: string;
  };
}

export interface ApplicationsState {
  applications: CommonApplication[];
  lastUpdated?: string;
}
