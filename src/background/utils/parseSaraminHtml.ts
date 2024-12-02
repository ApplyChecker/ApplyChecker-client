import type { CommonApplication } from "../../popup/types";
import * as cheerio from "cheerio";

const parseSaraminHtml = (html: string): CommonApplication[] => {
  const $ = cheerio.load(html);
  const applications: CommonApplication[] = [];

  $(".row._apply_list").each((index, element) => {
    const dataset = element.attribs;
    const txtStatus = $(element).find(".txt_status").text().trim();
    const txtSub = $(element).find(".txt_sub").text().trim();

    if (
      !dataset["data-company_nm"] ||
      !dataset["data-rec_idx"] ||
      !dataset["data-recruitapply_idx"]
    ) {
      console.warn("Required data is missing:", dataset);
      return;
    }

    const application: CommonApplication = {
      companyName: dataset["data-company_nm"] || "회사 정보 없음",
      position: dataset["data-rec_division"] || "직무 정보 없음",
      positionTitle: dataset["data-recruittitle"] || "직무 정보 없음",
      appliedDate:
        $(element).find(".col_date").text().trim() || new Date().toISOString(),
      status: {
        main: txtStatus || "상태 정보 없음",
        sub: txtSub || "",
      },
      company: {
        name: dataset["data-company_nm"] || "",
        id: dataset["data-csn"] || "",
      },
      recruitment: {
        id: dataset["data-rec_idx"] || "",
      },
      application: {
        id: dataset["data-recruitapply_idx"] || "",
      },
      meta: {
        platform: "saramin",
        lastUpdated: new Date().toISOString(),
        url: `https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=${dataset["data-rec_idx"]}`,
      },
    };

    applications.push(application);
  });

  return applications;
};

export default parseSaraminHtml;
