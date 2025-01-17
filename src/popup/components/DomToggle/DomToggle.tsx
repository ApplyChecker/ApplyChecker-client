import { Eye, EyeOff } from "lucide-react";
import Switch from "../Switch/Switch";

import "./domToggle.scss";

interface SettingsProps {
  isDimEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const DomToggle = ({ isDimEnabled, onToggle }: SettingsProps) => (
  <div className="settings">
    <div className="settings__label">
      {isDimEnabled ? (
        <Eye className="settings__icon settings__icon--active" />
      ) : (
        <EyeOff className="settings__icon settings__icon--inactive" />
      )}
      <span>지원한 공고 표시</span>
    </div>
    <Switch checked={isDimEnabled} onCheckedChange={onToggle} />
  </div>
);

export default DomToggle;
