import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { CircularCountDown } from "../../../components/circular-count-down";
import { useTournamentDetail } from "../../../context/tournament-detail";
import Translated from "../../../components/translated";

const TimeSection: FunctionComponent<{}> = () => {
  const { tournament, rounds } = useTournamentDetail();

  function getDate(): Date {
    if (tournament) {
      if (
        tournament?.kind === "ManualPairing" ||
        tournament?.kind === "RoundRobin" ||
        tournament?.kind === "TeamRoundRobin"
      ) {
        if (Array.isArray(rounds) && rounds.length > 0) {
          const sortedRounds = [...rounds];
          sortedRounds.sort((a, b) => {
            return (
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
            );
          });
          const now = new Date();
          const filteredRounds = sortedRounds.filter(
            (round) => now.getTime() - new Date(round.start_date).getTime() < 0
          );
          return new Date(
            filteredRounds.length > 0 ? filteredRounds[0].start_date : 0
          );
        } else {
          return new Date();
        }
      }
      return new Date(tournament.current_online_pairing_time);
    }
    return new Date();
  }

  return (
    <div className={style["time-section"]}>
      {tournament &&
        (tournament.kind === "ManualPairing" ||
          tournament.kind === "RoundRobin" ||
          tournament.kind === "TeamRoundRobin") &&
        rounds &&
        rounds.length > 0 && (
          <>
            <div className={style["round-time-starts"]}>
              <div className={style.text}>
                {Translated.byKey("nextRoundText")}
              </div>
            </div>
            <div className={style["round-time-countdown"]}>
              <CircularCountDown startDate={getDate()} />
            </div>
          </>
        )}
      {tournament &&
        tournament.kind !== "ManualPairing" &&
        tournament.kind !== "RoundRobin" &&
        tournament.kind !== "TeamRoundRobin" && (
          <>
            <div className={style["round-time-starts"]}>
              <div className={style.text}>
                {Translated.byKey("nextRoundText")}
              </div>
            </div>
            <div className={style["round-time-countdown"]}>
              <CircularCountDown startDate={getDate()} />
            </div>
          </>
        )}
    </div>
  );
};
export { TimeSection };
