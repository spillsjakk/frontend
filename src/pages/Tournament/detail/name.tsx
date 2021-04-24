import React, { FunctionComponent } from "react";
import UserLink from "../../../components/UserLink";
import { useTournamentDetail } from "../../../context/tournament-detail";
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
        <UserLink
          id={tournament?.organizer || ""}
          name={organizer_first_name + " " + organizer_last_name}
          ghost={false}
        />
      </div>
    </div>
  );
};
export { Name };
