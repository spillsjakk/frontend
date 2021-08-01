import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const Header: FunctionComponent<{}> = () => {
  return (
    <div className={style["header-container"]}>
      <div className={style.header}>{Translated.byKey("clubProfile")}</div>
      <div className={style.icon}>
        <img
          className={style.tick}
          alt="verified"
          src="https://drulpact.sirv.com/Images/sp/green-tick-min.png"
        />
      </div>
    </div>
  );
};
export { Header };
