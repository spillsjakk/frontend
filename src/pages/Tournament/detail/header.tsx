import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const Header: FunctionComponent<{}> = () => {
  return (
    <div className={style["header-container"]}>
      <div className={style.header}>
        {Translated.byKey("tournamentHomepage")}
      </div>
      <div className={style.icon}>
        <img className={style.tick} src="/images/tournament/green-tick.png" />
      </div>
    </div>
  );
};
export { Header };
