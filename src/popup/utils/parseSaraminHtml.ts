import type { CommonApplication } from "../types";

const parseSaraminHtml = (html: string): CommonApplication[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const applications: CommonApplication[] = [];

  const applicationRows = doc.querySelectorAll(".row._apply_list");

  applicationRows.forEach((row) => {
    const dataset = (row as HTMLElement).dataset;
    const txtStatus = row.querySelector(".txt_status")?.textContent?.trim();
    const txtSub = row.querySelector(".txt_sub")?.textContent?.trim();

    if (!dataset.company_nm || !dataset.rec_idx || !dataset.recruitapply_idx) {
      console.warn("Required data is missing:", dataset);
      return;
    }

    const application: CommonApplication = {
      companyName: dataset.company_nm || "회사 정보 없음",
      position: dataset.rec_division || "직무 정보 없음",
      positionTitle: dataset.recruittitle || "직무 정보 없음",
      appliedDate:
        row.querySelector(".col_date")?.textContent?.trim() ||
        new Date().toISOString(),

      status: {
        main: txtStatus || "상태 정보 없음",
        sub: txtSub || "",
      },

      company: {
        name: dataset.company_nm || "",
        id: dataset.csn || "",
      },

      recruitment: {
        id: dataset.rec_idx || "",
      },

      application: {
        id: dataset.recruitapply_idx || "",
      },

      meta: {
        platform: "saramin",
        lastUpdated: new Date().toISOString(),
        url: `https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=${dataset.rec_idx}`,
      },
    };

    applications.push(application);
  });

  return applications;
};

export default parseSaraminHtml;
