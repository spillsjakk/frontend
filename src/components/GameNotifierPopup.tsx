import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import React, { FunctionComponent } from "react";
import Translated from "./translated";
import { Link } from "react-router-dom";

interface Props {
  show: boolean;
  onClose: any;
}
const GameNotifierPopup: FunctionComponent<Props> = ({ show, onClose }) => {
  return (
    <>
      <Dialog open={show}>
        <DialogContent
          className="gamenotifier-text"
          sx={{ backgroundColor: "#F39C12", color: "#FFFFFF" }}
        >
          You are about the start playing a game!
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={onClose}>Dismiss</Button>
          <Button>
            <Link to="/calendar">
              <Translated str="goToLobby" />
            </Link>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { GameNotifierPopup };
