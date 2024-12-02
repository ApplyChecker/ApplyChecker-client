// ErrorMessage.tsx
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { APIError } from "../../types/application";
import "./loginError.scss";

interface ErrorMessageProps {
  error: APIError;
  onRedirect?: (url: string) => void;
  duration?: number;
}

const LoginError = ({
  error,
  onRedirect,
  duration = 3000,
}: ErrorMessageProps) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!error) return;

    setIsLeaving(false);
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [error, duration]);

  if (!error) return null;

  return (
    <div
      className={`error-message ${isLeaving ? "error-message--leaving" : ""}`}
    >
      <div className="error-message__content">
        <AlertTriangle className="error-message__icon" />
        <span className="error-message__text">{error.message}</span>
      </div>
      {error.url && (
        <button
          className="error-message__button"
          onClick={() => onRedirect?.(error.url!)}
        >
          로그인
        </button>
      )}
    </div>
  );
};

export default LoginError;
