import { useState } from "react";

import ApplySummary from "../ApplySummary/ApplySummary";
import DomToggle from "../DomToggle/DomToggle";
import SyncButtons from "../SyncButtons/SyncButtons";
import ApplyList from "../ApplyList/ApplyList";

import useWantedApi from "../../hooks/useWantedApi";
import useSaraminApi from "../../hooks/useSaramInApi";

import "./popupLayout.scss";

const PopupLayout = () => {
  const [isDimEnabled, setIsDimEnabled] = useState(true);

  const {
    applications: wantedApps,
    isLoading: wantedLoading,
    error: wantedError,
    progress: wantedProgress,
    fetchApplications: fetchWanted,
  } = useWantedApi();

  const {
    applications: saraminApps,
    isLoading: saraminLoading,
    error: saraminError,
    progress: saraminProgress,
    fetchApplications: fetchSaramin,
  } = useSaraminApi();

  const handleSync = async (platform?: "wanted" | "saramin") => {
    if (!platform) {
      await Promise.all([fetchWanted(), fetchSaramin()]);
      return;
    }

    if (platform === "wanted") await fetchWanted();
    if (platform === "saramin") await fetchSaramin();
  };

  return (
    <div className="job-list">
      <ApplySummary
        totalCount={
          wantedApps.applications.length + saraminApps.applications.length
        }
        counts={{
          wanted: wantedApps.applications.length,
          saramin: saraminApps.applications.length,
        }}
      />

      <DomToggle isDimEnabled={isDimEnabled} onToggle={setIsDimEnabled} />

      <SyncButtons
        platforms={{
          wanted: {
            isLoading: wantedLoading,
            error: wantedError,
            progress: wantedProgress,
            lastSyncDate: wantedApps.lastUpdated,
          },
          saramin: {
            isLoading: saraminLoading,
            error: saraminError,
            progress: saraminProgress,
            lastSyncDate: saraminApps.lastUpdated,
          },
        }}
        onSync={handleSync}
      />

      <ApplyList
        applications={[
          ...wantedApps.applications,
          ...saraminApps.applications,
        ].sort(
          (a, b) =>
            new Date(b.appliedDate).getTime() -
            new Date(a.appliedDate).getTime(),
        )}
      />
    </div>
  );
};

export default PopupLayout;
