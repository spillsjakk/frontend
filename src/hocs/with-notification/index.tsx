import React, { FunctionComponent, useState, Context, useContext } from "react";

import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

interface Props {
  open: boolean;
  message: string;
  setOpen: (e: boolean) => void;
  severity?: NotificationSeverity;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Notification: FunctionComponent<Props> = ({
  open,
  message,
  setOpen,
  severity = "info",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export { Notification };

export type NotificationSeverity = "warning" | "error" | "success" | "info";

const NotificationContext: Context<
  Partial<{
    open: boolean;
    setOpen: (e: boolean) => void;
    setMessage: (e: string) => void;
    setSeverity: (e: NotificationSeverity) => void;
    notify: (severity: NotificationSeverity, message: string) => void;
  }>
> = React.createContext({});

export const NotificationProvider = NotificationContext.Provider;
export default NotificationContext;
export const useNotification = () => useContext(NotificationContext);

const WithNotification: FunctionComponent = ({ children }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] =
    useState<NotificationSeverity>("info");
  function notify(severity: NotificationSeverity, message: string) {
    setNotificationSeverity(severity);
    setNotificationMessage(message);
    setNotificationOpen(true);
  }
  return (
    <NotificationProvider
      value={{
        open: notificationOpen,
        setOpen: setNotificationOpen,
        setMessage: setNotificationMessage,
        setSeverity: setNotificationSeverity,
        notify,
      }}
    >
      {children}
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        setOpen={setNotificationOpen}
      />
    </NotificationProvider>
  );
};
export { WithNotification };
