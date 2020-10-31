import React, { FunctionComponent } from "react";
import { useTournamentRound } from "../../context/tournament-round";

const AddRound: FunctionComponent<{}> = () => {
  const roundContext = useTournamentRound();
  return (
    <>
      <button
        onClick={() => {
          roundContext.add();
        }}
      >
        Add round
      </button>
    </>
  );
};
export { AddRound };
