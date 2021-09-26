import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import Translated from "../../components/translated";

interface Props {
  id: string;
  name: string;
  profile: string;
}

const LeagueCard: FunctionComponent<Props> = (props) => {
  return (
    <div className={style.content}>
      <div className={style.card}>
        <img
          height="130"
          width="130"
          className={style.image}
          src={
            props.profile ||
            "https://drulpact.sirv.com/Images/sp/pp-placeholder-min.png"
          }
        />
        <div className={style.name}>{props.name}</div>
        <Link to={`/league/view/${props.id}`} className={style.button}>
          {Translated.byKey("moreInfo").toUpperCase()}
        </Link>
      </div>
    </div>
  );
};

export { LeagueCard };
