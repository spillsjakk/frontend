import React, { FunctionComponent } from "react";
import { useRoundSetupPopup } from "../../context/round-setup-popup";
import { useTournamentRound } from "../../context/tournament-round";

interface Props {
  roundNumber: number;
}

const SetupRoundButton: FunctionComponent<Props> = ({ roundNumber }) => {
  const { rounds } = useTournamentRound();
  const { open } = useRoundSetupPopup();
  return (
    <>
      <div className="setup-round">
        <span className="time">
          starting time:{" "}
          {rounds.find((round) => round.number === roundNumber)?.start_date}
        </span>
        <button onClick={() => open(roundNumber)}>Setup </button>
      </div>
    </>
  );
};

export { SetupRoundButton };
