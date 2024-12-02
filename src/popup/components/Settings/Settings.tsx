import { Eye, EyeOff } from "lucide-react";
import Switch from "../Switch/Switch";
import "./Settings.scss";

interface SettingsProps {
  isDimEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const Settings = ({ isDimEnabled, onToggle }: SettingsProps) => (
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

export default Settings;
