import React from "react";

import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { useStatusReporter } from "~/components/contexts/StatusReporter";
import css from "./header.scss";

/**
 * A simple app Header bar, which also shows the Status from StatusReporter
 */
export function Header() {
  const statusReporter = useStatusReporter();

  return (
    <AppBar position="sticky" variant="elevation" className={css.appBar}>
      <Typography>
        <span> Rippey's Message App </span>

        {statusReporter.status && (
          <span className={css.statusMessage}>
            <CircularProgress size={16} color="inherit" className={css.spinner} />
            <span> {statusReporter.status} </span>
          </span>
        )}
      </Typography>
    </AppBar>
  );
}
