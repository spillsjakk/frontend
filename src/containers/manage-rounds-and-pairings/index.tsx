import React, { FunctionComponent } from "react";
import { WithTournamentRound } from "../../hocs/tournament-round";
import { WithTournamentPairing } from "../../hocs/tournament-pairing";
import { AddRound } from "./add-round";
import { Panel } from "./panel";
import Translated from "../../components/Translated";

const ManageRoundsAndPairings: FunctionComponent<{}> = () => {
  return (
    <>
      <h3>
        <Translated str="manageRoundsAndPairings" />
      </h3>
      <WithTournamentRound>
        <WithTournamentPairing>
          <AddRound />
          <Panel />
        </WithTournamentPairing>
      </WithTournamentRound>
    </>
  );
};
export { ManageRoundsAndPairings };
