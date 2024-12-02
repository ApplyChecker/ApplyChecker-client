import { useState } from "react";
import "./jobList.scss";

import Header from "../Header/Header";
import Settings from "../Settings/Settings";
import SyncButtons from "../SyncButtons/SyncButtons";
import ApplicationList from "../ApplicationList/ApplicationList";

import useWantedApi from "../../hooks/useWantedApi";
import useSaraminApi from "../../hooks/useSaramInApi";

const JobList = () => {
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
      <Header
        totalCount={
          wantedApps.applications.length + saraminApps.applications.length
        }
        counts={{
          wanted: wantedApps.applications.length,
          saramin: saraminApps.applications.length,
        }}
      />

      <Settings isDimEnabled={isDimEnabled} onToggle={setIsDimEnabled} />

      <SyncButtons
        platforms={{
          wanted: {
            isLoading: wantedLoading,
            error: wantedError,
            progress: wantedProgress,
          },
          saramin: {
            isLoading: saraminLoading,
            error: saraminError,
            progress: saraminProgress,
          },
        }}
        onSync={handleSync}
      />

      <ApplicationList
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

export default JobList;
