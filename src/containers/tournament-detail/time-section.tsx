import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { CircularCountDown } from "../../components/circular-count-down";
import { useTournamentDetail } from "../../context/tournament-detail";

const TimeSection: FunctionComponent<{}> = () => {
  const { tournament } = useTournamentDetail();
  return (
    <div className={style["time-section"]}>
      <div className={style["round-time-starts"]}>
        <div className={style.text}>
          The next online / (over-the-board) round starts in:
        </div>
      </div>
      <div className={style["round-time-countdown"]}>
        {tournament && (
          <CircularCountDown
            startDate={new Date(tournament.first_online_pairing)}
          />
        )}
      </div>
    </div>
  );
};
export { TimeSection };
