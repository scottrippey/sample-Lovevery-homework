import React from "react";

// @ts-ignore
const StatusReporterContext = React.createContext<StatusReporter>(null);

/**
 * Creates and provides the StatusReporter API
 *
 * The StatusReporter is used to show a status, or error, in the header.
 */
export function StatusReporterProvider({ children }) {
  const [status, setStatus] = React.useState<JSX.Element | null>(null);
  const statusReporter: StatusReporter = {
    status,
    setStatus,
    clearStatus() {
      setStatus(null);
    },
  };
  return <StatusReporterContext.Provider value={statusReporter}>{children}</StatusReporterContext.Provider>;
}

interface StatusReporter {
  status: JSX.Element | null;
  setStatus(status: JSX.Element | null): void;
  clearStatus(): void;
}

/**
 * Retrieves the StatusReporter API
 */
export function useStatusReporter() {
  return React.useContext(StatusReporterContext);
}
