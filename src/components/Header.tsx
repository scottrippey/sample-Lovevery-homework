import React from "react";

import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import {useStatusReporter} from "~/components/StatusReporter";

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
