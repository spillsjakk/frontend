import React, { FunctionComponent, memo, useEffect, useState } from "react";
import { CircularProgressbarWithChildren as CircularProgressbar } from "react-circular-progressbar";
import Translated from "../translated";
import style from "./style.module.scss";
import "./custom.css";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const Circle: FunctionComponent<{
  min: number;
  max: number;
  value: number;
  textKey: string;
}> = memo((props) => {
  return (
    <CircularProgressbar
      minValue={props.min}
      maxValue={props.max}
      value={props.value}
    >
      <div className={style.number}>{pad(props.value)} </div>
      <div className={style.name}>{Translated.byKey(props.textKey)}</div>
    </CircularProgressbar>
  );
});

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
    if (
      progress.days === 0 &&
      progress.hours === 0 &&
      progress.minutes === 0 &&
      progress.seconds === 0 &&
      days === 0 &&
      hours === 0 &&
      minutes === 0 &&
      seconds === 0
    ) {
      return;
    }
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
        <Circle min={0} max={365} value={progress.days} textKey={"days"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={24} value={progress.hours} textKey={"hours"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={60} value={progress.minutes} textKey={"minutes"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={60} value={progress.seconds} textKey={"seconds"} />
      </div>
    </div>
  );
};

export { CircularCountDown };
