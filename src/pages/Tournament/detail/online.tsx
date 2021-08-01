import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const Online = () => {
  return (
    <div className="image">
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

export { Online };
