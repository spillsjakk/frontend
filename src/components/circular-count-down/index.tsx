import React, { FunctionComponent, useEffect, useState } from "react";
import { CircularProgressbarWithChildren as CircularProgressbar } from "react-circular-progressbar";
import Translated from "../translated";
import style from "./style.module.scss";
import "./custom.css";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface Props {
  startDate: Date;
}

const CircularCountDown: FunctionComponent<Props> = ({ startDate }) => {
  const [progress, setProgress] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  function tick() {
    const left_now = Math.max(0, startDate.getTime() - new Date().getTime());
    const total_seconds = Math.ceil(left_now / 1000);
    const days_f = total_seconds / 86400;
    const days = Math.floor(days_f);
    const total_seconds_today = total_seconds % 86400;
    const hours_f = total_seconds_today / 3600;
    const hours = Math.floor(hours_f);
    const seconds_left = total_seconds_today % 3600;
    const minutes_f = seconds_left / 60;
    const minutes = Math.floor(minutes_f);
    const seconds = seconds_left % 60;
    setProgress({
      days,
      hours,
      minutes,
      seconds,
    });
  }
  useEffect(() => {
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={style["countdown-container"]}>
      <div className={style.item}>
        <CircularProgressbar minValue={0} maxValue={365} value={progress.days}>
          <div className={style.number}>{pad(progress.days)} </div>
          <div className={style.name}>{Translated.byKey("days")}</div>
        </CircularProgressbar>
      </div>
      <div className={style.item}>
        <CircularProgressbar minValue={0} maxValue={24} value={progress.hours}>
          <div className={style.number}>{pad(progress.hours)} </div>
          <div className={style.name}>{Translated.byKey("hours")}</div>
        </CircularProgressbar>
      </div>
      <div className={style.item}>
        <CircularProgressbar
          minValue={0}
          maxValue={60}
          value={progress.minutes}
        >
          <div className={style.number}>{pad(progress.minutes)} </div>
          <div className={style.name}>{Translated.byKey("minutes")}</div>
        </CircularProgressbar>
      </div>
      <div className={style.item}>
        <CircularProgressbar
          minValue={0}
          maxValue={60}
          value={progress.seconds}
        >
          <div className={style.number}>{pad(progress.seconds)} </div>
          <div className={style.name}>{Translated.byKey("seconds")}</div>
        </CircularProgressbar>
      </div>
    </div>
  );
};

export { CircularCountDown };
