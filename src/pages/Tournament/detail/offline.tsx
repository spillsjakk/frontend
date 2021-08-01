import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const Offline = () => {
  return (
    <div className="image">
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

export { Offline };
