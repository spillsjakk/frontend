import React, { FunctionComponent, useEffect, useState } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";
import { Link } from "react-router-dom";
import { useOrgsClubs } from "../../../hocs/user-orgs-and-clubs/index";
import { ActionButton } from "./action-button";

const Name: FunctionComponent<{}> = () => {
  const [name, setName] = useState("");
  const { league } = useLeague();
  const { orgs, clubs } = useOrgsClubs();

  useEffect(() => {
    if (orgs && clubs && league) {
      const entity = [...orgs, ...clubs].find(
        (item) => item.id === league.organization || item.id === league.club
      );
      if (entity) {
        setName(entity.name);
      }
    }
  }, [orgs, clubs, league]);

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{league?.name}</div>

      <div className={style.organiser}>
        {league?.organization ? (
          <Link to={`/organization/view/${league?.organization}`}>{name}</Link>
        ) : (
          <Link to={`/club/view/${league?.club}`}>{name}</Link>
        )}
      </div>
      <ActionButton />
    </div>
  );
};
export { Name };
