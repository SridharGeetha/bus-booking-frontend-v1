import React from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

const AppNotification = ( {type, title, message} ) => {
  return (
    <>
      <Alert severity={type}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </>
  );
};
export default AppNotification;
