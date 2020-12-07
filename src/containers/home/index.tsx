import React, { FunctionComponent } from "react";
import { Features } from "./features";
import { Tournaments } from "./tournaments";
import style from "./style.module.scss";
import Translated from "../../components/translated";

const Home: FunctionComponent<{}> = () => {
  return (
    <div className={style["home-container"]}>
      <div className={style["features-container"]}>
        <div className={style.header}>
          <Translated str="featuresWeOffer" />
        </div>
        <Features />
      </div>
      <div className={style["tournaments-container"]}>
        <div className={style.header}>
          <Translated str="liveAndUpcomingTournaments" />
        </div>
        <Tournaments />
      </div>
    </div>
  );
};

export { Home };
