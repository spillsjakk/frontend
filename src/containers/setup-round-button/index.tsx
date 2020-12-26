import React, { FunctionComponent, useEffect, useState } from "react";
import { useRoundSetupPopup } from "../../context/round-setup-popup";
import { Round, useTournamentRound } from "../../context/tournament-round";
import { defaultDate } from "../../constants";
import "./style.scss";
import Translated from "../../components/translated";

interface Props {
  roundNumber: number;
}

const SetupRoundButton: FunctionComponent<Props> = ({ roundNumber }) => {
  const [round, setRound] = useState<Round | undefined>();
  const [firstNotSetupRound, setFirstNotSetupRound] = useState<number>();
  const { rounds } = useTournamentRound();
  const { open } = useRoundSetupPopup();
  useEffect(() => {
    setRound(rounds.find((round) => round.number === roundNumber));
    const notSetupRounds = rounds.filter(
      (round) => round.start_date === "1970-01-01T00:00:00Z"
    );
    setFirstNotSetupRound(rounds.length - notSetupRounds.length + 1);
  }, [rounds]);
  return (
    <div id="setup-round-button">
      {(round?.start_date !== defaultDate ||
        round.number === firstNotSetupRound) && (
        <div className="setup-round">
          <div className="time">
            {round?.start_date !== defaultDate &&
              `${Translated.byKey("startDate")}: ${new Date(
                round?.start_date || 0
              ).toLocaleString()}`}
          </div>
          {round && round.number === firstNotSetupRound && (
            <button onClick={() => open(roundNumber)}>
              {Translated.byKey("setup")}{" "}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export { SetupRoundButton };
