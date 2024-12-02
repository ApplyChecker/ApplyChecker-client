import type { CommonApplication } from "../../popup/types";

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

const transformApplication = (app: WantedApplication): CommonApplication => ({
  companyName: app.job.company_name,
  position: app.job.position,
  positionTitle: app.job.position,
  appliedDate: new Date(app.create_time).toLocaleDateString("ko-KR"),
  status: {
    main: app.status,
    sub: app.status_reward,
  },
  company: {
    id: app.company_id.toString(),
    name: app.job.company_name,
  },
  recruitment: {
    id: app.job.id.toString(),
    location: app.job.location,
  },
  application: {
    id: app.id.toString(),
  },
  meta: {
    platform: "wanted",
    lastUpdated: new Date().toISOString(),
    url: `https://www.wanted.co.kr/wd/${app.job.id}`,
  },
});

export default transformApplication;
