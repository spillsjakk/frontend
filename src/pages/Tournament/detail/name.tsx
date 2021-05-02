import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useTournamentDetail } from "../../../context/tournament-detail";
import style from "./style.module.scss";

const Name: FunctionComponent<{}> = () => {
  const { tournament, organiser_name } = useTournamentDetail();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{tournament?.name}</div>

      <div className={style.organiser}>
        <Link
          to={
            tournament?.organiser_type === "club"
              ? `/club/view/${tournament?.organiser}`
              : `/organization/view/${tournament?.organiser}`
          }
        >
          {organiser_name}
        </Link>
      </div>
    </div>
  );
};
export { Name };
