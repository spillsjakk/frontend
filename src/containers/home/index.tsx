import React, { FunctionComponent } from "react";
import { Features } from "./features";
import { Tournaments } from "./tournaments";
import style from "./style.module.scss";

const Home: FunctionComponent<{}> = () => {
  return (
    <div className={style["home-container"]}>
      <div className={style["features-container"]}>
        <div className={style.header}>FEATURES WE OFFER</div>
        <Features />
      </div>
      <div className={style["tournaments-container"]}>
        <div className={style.header}>LIVE & UPCOMING TOURNAMENTS</div>
        <Tournaments />
      </div>
    </div>
  );
};

export { Home };
