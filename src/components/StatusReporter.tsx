import React from "react";

// @ts-ignore
const StatusReporterContext = React.createContext<StatusReporter>(null);

export const StatusReporterProvider = ({ children }) => {
  const statusAPI = useCreateStatusReporter();
  return <StatusReporterContext.Provider value={statusAPI}>{children}</StatusReporterContext.Provider>;
};

type StatusReporter = ReturnType<typeof useCreateStatusReporter>;

function useCreateStatusReporter() {
  const [status, setStatus] = React.useState<JSX.Element | null>(null);
  const statusReporter = React.useMemo(
    () => ({
      status,
      setStatus,
      clearStatus() {
        setStatus(null);
      },
    }),
    [status]
  );
  return statusReporter;
}

/**
 * Retrieves the StatusReporter
 */
export function useStatusReporter() {
  return React.useContext(StatusReporterContext);
}
