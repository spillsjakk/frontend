import React, { FunctionComponent } from "react";
import Translated from "../translated";
import style from "./style.module.scss";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  timeControl: number;
  timeControlInterval: number;
  format: string;
  rounds: number;
  startDate: string;
  profile: string;
}

function getNumberWithZero(value: number) {
  if (value < 10) {
    return `0${value}`;
  } else {
    return value;
  }
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return "";
  } else {
    return (
      <span>
        {days ? `${getNumberWithZero(days)} ${Translated.byKey("days")} ` : ""}
        {getNumberWithZero(hours)}:{getNumberWithZero(minutes)}:
        {getNumberWithZero(seconds)}
      </span>
    );
  }
};

const Card: FunctionComponent<Props> = (props) => {
  return (
    <>
      <div className={style.card}>
        <img
          height="130"
          width="130"
          className={style.image}
          src={
            props.profile ||
            "https://drulpact.sirv.com/Images/sp/home-tournament-placeholder-min.jpg"
          }
        />
        <div className={style.name}>{props.name}</div>
        <div className={style.time}>
          {Translated.byKey(
            props.format.replace(/^.{1}/g, props.format[0].toLowerCase())
          )}{" "}
          · {props.rounds} {Translated.byKey("rounds")}
        </div>
        <div className={style["round-time"]}>
          {
            <Countdown
              date={new Date(props.startDate).getTime()}
              renderer={renderer}
            />
          }
        </div>
        <Link to={`/tournament/view/${props.id}`} className={style.button}>
          {Translated.byKey("moreInfo").toUpperCase()}
        </Link>
      </div>
    </>
  );
};

export { Card };
