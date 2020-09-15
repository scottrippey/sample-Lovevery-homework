import {useStatusReporter} from "~/components/StatusReporter";
import {AppBar, CircularProgress, Typography} from "@material-ui/core";
import React from "react";

export const Header = () => {
  const statusReporter = useStatusReporter();
  return (
    <AppBar position="sticky" variant="elevation" className="p-10 px-20">
      <Typography>
        <span> Rippey's Message App </span>
        {
          statusReporter.status &&
          <span className="ml-20">
            <CircularProgress size={16} color="inherit" className="inline-block" /> {statusReporter.status}
          </span>
        }
      </Typography>
    </AppBar>
  );
};
