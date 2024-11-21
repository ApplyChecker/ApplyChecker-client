import type { ApiResponse } from "../types/application";

const mockData: ApiResponse = {
  applications: [
    {
      status: "reject",
      company_id: 48929,
      job: {
        status: "active",
        logo_img: "https://static.wanted.co.kr/images/wdes/0_5.e92d85a8.png",
        company_name: "바이트사이즈",
        position: "Fullstack 개발자",
      },
      create_time: "2024-11-18T19:58:07",
      open_time: "2024-11-19T10:14:26",
    },
    {
      status: "complete",
      company_id: 7074,
      job: {
        status: "active",
        logo_img: "https://static.wanted.co.kr/images/wdes/0_4.598aaa80.jpg",
        company_name: "에누마",
        position: "웹프론트엔드 개발자 (5년 이상)",
      },
      create_time: "2024-11-18T19:55:30",
      open_time: "2024-11-19T18:55:43",
    },
    {
      status: "reject",
      company_id: 50369,
      job: {
        status: "request",
        logo_img: "https://static.wanted.co.kr/images/wdes/0_4.4e3bee82.jpg",
        company_name: "에이머슬리",
        position: "프론트엔드 개발자",
      },
      create_time: "2024-11-18T19:55:02",
      open_time: "2024-11-18T20:29:25",
    },
  ],
  total: 343,
  summary: {
    hire: 0,
    complete: 26,
    pass: 2,
    accept: 2,
    write: 4,
    reject: 315,
    active: 343,
  },
};

export default mockData;
