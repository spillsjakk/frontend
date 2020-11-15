import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import style from "./style.module.scss";

const Name: FunctionComponent<{}> = () => {
  const {
    tournament,
    organizer_first_name,
    organizer_last_name,
  } = useTournamentDetail();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{tournament?.name}</div>

      <div className={style.organiser}>
        organiser:{" "}
        <span>{`${organizer_first_name} ${organizer_last_name}`}</span>
      </div>
    </div>
  );
};
export { Name };
