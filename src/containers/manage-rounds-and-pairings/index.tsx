import React, { FunctionComponent } from "react";
import { WithTournamentRound } from "../../hocs/tournament-round";
import { WithTournamentPairing } from "../../hocs/tournament-pairing";
import { AddRound } from "./add-round";

const ManageRoundsAndPairings: FunctionComponent<{}> = () => {
  return (
    <WithTournamentRound>
      <WithTournamentPairing>
        <AddRound />
      </WithTournamentPairing>
    </WithTournamentRound>
  );
};
export { ManageRoundsAndPairings };
