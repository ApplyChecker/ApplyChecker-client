// components/ApplicationList/ApplicationList.tsx
import { useState } from "react";
import type { CommonApplication } from "../../types";
import "./applicationList.scss";

interface ApplicationListProps {
  applications: CommonApplication[];
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const displayedApps = isExpanded ? applications : applications.slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "서류통과":
        return "status--pass";
      case "불합격":
        return "status--fail";
      default:
        return "status--pending";
    }
  };

  return (
    <div className="applications">
      <button
        className="applications__trigger"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <span>
          최근 지원 내역 (
          {isExpanded ? applications.length : Math.min(10, applications.length)}
          건)
        </span>
        <svg
          className={`applications__icon ${isExpanded ? "rotate-90" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {isExpanded && (
        <div className="applications__container">
          <div className="applications__list">
            {displayedApps.map((app) => (
              <div key={app.application.id} className="application-card">
                <div className="application-card__main">
                  <div className="application-card__title">
                    <div className="application-card__primary">
                      <span className="application-card__company">
                        {app.companyName}
                      </span>
                      <svg
                        width="4"
                        height="4"
                        className="application-card__dot"
                      >
                        <circle cx="2" cy="2" r="2" fill="currentColor" />
                      </svg>
                      <span
                        className="application-card__position"
                        title={app.position}
                      >
                        {app.position}
                      </span>
                    </div>
                    <div className="application-card__status">
                      <svg
                        width="4"
                        height="4"
                        className={getStatusColor(app.status.main)}
                      >
                        <circle cx="2" cy="2" r="2" fill="currentColor" />
                      </svg>
                      <span>{app.status.main}</span>
                    </div>
                  </div>
                </div>
                <div className="application-card__sub">
                  <span>{app.appliedDate.split(" ")[0]}</span>
                  <svg width="2" height="2" className="application-card__dot">
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </svg>
                  <span className={`platform platform--${app.meta.platform}`}>
                    {app.meta.platform === "wanted" ? "원티드" : "사람인"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {applications.length > 10 && !showAll && (
            <button
              className="applications__show-more"
              onClick={() => {
                setShowAll(true);
              }}
            >
              지원내역 모두보기 ({applications.length}건)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default ApplicationList;
