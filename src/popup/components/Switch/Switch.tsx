import React from "react";
import "./Switch.scss";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`switch ${checked ? "switch--checked" : ""}`}
      onClick={() => {
        onCheckedChange(!checked);
      }}
    >
      <span className="switch__thumb" />
    </button>
  );
};

export default Switch;
