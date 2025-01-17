import React from "react";
import "./Progress.scss";

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress ${className}`}>
      <div
        className="progress__bar"
        style={{ width: `${normalizedValue}%` }}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default Progress;
