import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import style from "./style.module.scss";

const Name: FunctionComponent<{}> = () => {
  const { tournament } = useTournamentDetail();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{tournament?.name}</div>

      <div className={style.organiser}>
        organiser: <span>{tournament?.organizer}</span>
      </div>
    </div>
  );
};
export { Name };
