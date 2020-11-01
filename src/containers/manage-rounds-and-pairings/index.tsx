import React, { FunctionComponent } from "react";
import { WithTournamentRound } from "../../hocs/tournament-round";
import { WithTournamentPairing } from "../../hocs/tournament-pairing";
import { AddRound } from "./add-round";
import { Panel } from "./panel";
import Translated from "../../components/Translated";
import style from "./style.module.css";

const ManageRoundsAndPairings: FunctionComponent<{}> = () => {
  return (
    <>
      <WithTournamentRound>
        <WithTournamentPairing>
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
        </WithTournamentPairing>
      </WithTournamentRound>
    </>
  );
};
export { ManageRoundsAndPairings };
