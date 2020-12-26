import React, { FunctionComponent } from "react";
import { AddRound } from "./add-round";
import { Panel } from "./panel";
import Translated from "../../components/translated";
import style from "./style.module.css";

const ManageRoundsAndPairings: FunctionComponent<{}> = () => {
  return (
    <div className={style.wrapper}>
      <div className={style["heading-container"]}>
        <div>
          <h3>
            <Translated str="manageRoundsAndPairings" />
          </h3>
        </div>
        <div className={style["add-round-button"]}>
          <AddRound />
        </div>
      </div>
      <div className={style.panel}>
        <Panel />
      </div>
    </div>
  );
};
export { ManageRoundsAndPairings };
