import React, { FunctionComponent } from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import style from "./style.module.scss";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  changeOpen: (open: boolean) => void;
  messages: object[];
}

const MessageNotification: FunctionComponent<Props> = ({
  open,
  changeOpen,
  messages,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      className={style.messageNotification}
      onClose={() => changeOpen(false)}
      message={<Link to="/inbox">{messages.length} new messages</Link>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => changeOpen(false)}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

export { MessageNotification };
