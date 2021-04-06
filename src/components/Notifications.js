import React from "react";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import "../styles/Notifications.scss";
import { Button } from "@material-ui/core";

function Notifications() {
  return (
    <div className="notifications">
      <Button variant="outlined">
        <NotificationsNoneIcon />
      </Button>
    </div>
  );
}

export default Notifications;
