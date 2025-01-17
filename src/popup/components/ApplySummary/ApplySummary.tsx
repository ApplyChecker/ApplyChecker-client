import React from "react";
import "./applySummary.scss";

interface HeaderProps {
  totalCount: number;
  counts: {
    wanted: number;
    saramin: number;
  };
}

const ApplySummary = ({ totalCount, counts }: HeaderProps) => (
  <div className="header">
    <div className="header__main">
      <h1 className="header__title">구직활동 현황</h1>
      <div className="header__total">
        <span className="header__count">{totalCount}</span>
        <span className="header__label">지원</span>
      </div>
    </div>
    <div className="header__platforms">
      <span className="header__badge header__badge--wanted">
        원티드 {counts.wanted}
      </span>
      <span className="header__badge header__badge--saramin">
        사람인 {counts.saramin}
      </span>
    </div>
  </div>
);
export default ApplySummary;
