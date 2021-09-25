import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../translated";
import style from "./style.module.scss";

const Offline = () => {
  return (
    <div>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="offline">
            <strong>{Translated.byKey("offline")}</strong>
          </Tooltip>
        }
      >
        <img
          className={style.offline}
          src="https://drulpact.sirv.com/sp/offline-circle.svg"
          height="15"
          width="15"
        />
      </OverlayTrigger>
    </div>
  );
};

const Online = () => {
  return (
    <div>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="online">
            <strong>{Translated.byKey("online")}</strong>
          </Tooltip>
        }
      >
        <img
          className={style.online}
          src="https://drulpact.sirv.com/sp/online-circle.svg"
          height="15"
          width="15"
        />
      </OverlayTrigger>
    </div>
  );
};

export { Offline, Online };
