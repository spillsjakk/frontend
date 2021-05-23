import React, { FunctionComponent } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  useMediaQuery,
} from "@material-ui/core";
import style from "./style.module.scss";

const MobileUserWarning: FunctionComponent<unknown> = () => {
  const matches = useMediaQuery("(max-width:420px)");
  return (
    <Dialog open={matches} className={style.dialog}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Spillsjakk is under active development, for best results please use a
          desktop PC or laptop - a mobile version is underway and will be coming
          soon.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export { MobileUserWarning };
