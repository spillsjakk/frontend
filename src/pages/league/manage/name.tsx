import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";
import { League } from "./league";
import { Link } from "react-router-dom";

const Name: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{league?.name}</div>

      <div className={style.organiser}>
        {league?.organization ? (
          <Link to={`/organization/view/${league?.organization}`}>
            {league?.organization}
          </Link>
        ) : (
          <Link to={`/club/view/${league?.club}`}>{league?.club}</Link>
        )}
      </div>
      <League />
    </div>
  );
};
export { Name };
