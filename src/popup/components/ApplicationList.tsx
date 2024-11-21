import React from "react";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Application } from "../types/application";

interface ApplicationListProps {
  applications: Application[]; // Application[] 타입으로 변경
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
}) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case "complete":
        return "지원완료";
      case "pass":
        return "합격";
      case "reject":
        return "불합격";
      case "hire":
        return "채용";
      default:
        return status;
    }
  };

  return (
    <div className="applications-list">
      {applications.map((app, index) => (
        <div key={index} className="application-item">
          <img src={app.job?.logo_img} alt={"로고"} className="company-logo" />
          <div className="info">
            <div className="company-name">{app.job.company_name}</div>
            <div className="position">{app.job.position}</div>
          </div>
          <div className={`status ${app.status}`}>
            {getStatusText(app.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
