import React from "react";
import type { ProcessedWantedApplication } from "../types";

interface ApplicationListProps {
  applications: ProcessedWantedApplication[];
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
}) => {
  return (
    <div
      className="applications-list"
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
            border: "1px solid #e9ecef",
          }}
          className="application-item hover:shadow-md"
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            {app.companyName}
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "#4a5568",
              marginBottom: "4px",
              fontWeight: "500",
            }}
          >
            {app.position}
          </p>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <StatusBadge status={app.status} />
            <p
              style={{
                fontSize: "13px",
                color: "#718096",
              }}
            >
              {app.appliedDate}
            </p>
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#718096",
              marginBottom: "8px",
            }}
          >
            <LocationIcon /> {app.location}
          </p>

          <div
            style={{
              borderTop: "1px solid #e9ecef",
              paddingTop: "8px",
              marginTop: "8px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#718096",
            }}
          >
            <p>💰 {app.jobDetail.reward}</p>
            <p>📋 {app.jobDetail.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 상태에 따른 배지 컴포넌트
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status.toLowerCase()) {
      case "complete":
        return { bg: "#e6f4ea", text: "#1e7e34" };
      case "pass":
        return { bg: "#cce5ff", text: "#004085" };
      case "hire":
        return { bg: "#d4edda", text: "#155724" };
      case "reject":
        return { bg: "#f8d7da", text: "#721c24" };
      default:
        return { bg: "#e9ecef", text: "#495057" };
    }
  };

  const colors = getStatusColor(status);

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
};

// 위치 아이콘 컴포넌트
const LocationIcon: React.FC = () => (
  <span role="img" aria-label="location" style={{ marginRight: "4px" }}>
    📍
  </span>
);

export default ApplicationList;
