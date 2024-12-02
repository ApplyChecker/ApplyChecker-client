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

  const getStatusText = (status: string, platform: string) => {
    if (platform === "wanted") {
      switch (status) {
        case "complete":
          return "지원완료";
        case "reject":
          return "불합격";
        default:
          return status;
      }
    }
    return status;
  };

  const getStatusClassName = (status: string, platform: string) => {
    if (platform === "wanted") {
      switch (status) {
        case "complete":
          return "status--pending";
        case "reject":
          return "status--fail";
        default:
          return "status--default";
      }
    }
    switch (status) {
      case "서류통과":
        return "status--pass";
      case "불합격":
        return "status--fail";
      case "최종합격":
        return "status--success";
      default:
        return "status--default";
    }
  };

  const formatDate = (dateStr: string) => {
    if (dateStr.includes(":")) {
      const [datePart] = dateStr.split(" ");
      const [, month, day] = datePart.split(".");

      return `${month}.${day}`;
    } else {
      const parts = dateStr
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean);

      return `${parts[1]}.${parts[2]}`;
    }
  };

  return (
    <div className="application-list">
      <button
        className="application-list__header"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <span className="application-list__title">
          최근 지원 내역 (
          {isExpanded
            ? showAll
              ? applications.length
              : 10
            : applications.length}
          건)
        </span>
        <svg
          className={`application-list__arrow ${
            isExpanded ? "is-expanded" : ""
          }`}
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
        <div className="application-list__content">
          <div className="application-list__table">
            <div className="application-list__table-header">
              <div className="header__item">회사명</div>
              <div className="header__item">직무</div>
              <div className="header__item">지원일</div>
              <div className="header__item">사이트</div>
              <div className="header__item">상태</div>
            </div>
            <div className="application-list__items">
              {displayedApps.map((app) => (
                <div key={app.application.id} className="application-item">
                  <div className="application-item__company">
                    {app.companyName}
                  </div>
                  <div className="application-item__position">
                    {app.position}
                  </div>
                  <div className="application-item__date">
                    {formatDate(app.appliedDate)}
                  </div>
                  <div
                    className={`application-item__platform platform--${app.meta.platform}`}
                  >
                    {app.meta.platform === "wanted" ? "원티드" : "사람인"}
                  </div>
                  <div
                    className={`application-item__status ${getStatusClassName(
                      app.status.main,
                      app.meta.platform,
                    )}`}
                  >
                    {getStatusText(app.status.main, app.meta.platform)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isExpanded && !showAll && applications.length > 10 && (
            <button
              className="application-list__show-more"
              onClick={() => {
                setShowAll(true);
              }}
            >
              전체 지원내역 보기 ({applications.length}건)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
