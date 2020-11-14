import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { CircularCountDown } from "../../components/circular-count-down";
import { useTournamentDetail } from "../../context/tournament-detail";
import Translated from "../../components/Translated";

const TimeSection: FunctionComponent<{}> = () => {
  const { tournament, rounds } = useTournamentDetail();

  function getDate() {
    if (tournament && Array.isArray(rounds) && rounds.length > 0) {
      if (tournament?.kind === "ManualPairing") {
        const sortedRounds = [...rounds];
        sortedRounds.sort((a, b) => {
          return (
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );
        });
        const now = new Date();
        const filteredRounds = sortedRounds.filter(
          (round) => now.getTime() - new Date(round.start_date).getTime() < 0
        );
        return new Date(
          filteredRounds.length > 0 ? filteredRounds[0].start_date : ""
        );
      }

      return new Date(tournament.first_online_pairing);
    }
    return new Date();
  }

  return (
    <div className={style["time-section"]}>
      <div className={style["round-time-starts"]}>
        <div className={style.text}>{Translated.byKey("nextRoundText")}</div>
      </div>
      <div className={style["round-time-countdown"]}>
        {tournament && <CircularCountDown startDate={getDate()} />}
      </div>
    </div>
  );
};
export { TimeSection };
