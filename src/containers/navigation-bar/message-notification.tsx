import React, { FunctionComponent } from "react";
import { Snackbar } from "@material-ui/core";
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
    <Link to="/inbox">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => changeOpen(false)}
        message={`${messages.length} new messages`}
        className={style.messageNotification}
      />
    </Link>
  );
};

export { MessageNotification };
