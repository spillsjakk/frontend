import React, { FunctionComponent, useEffect, useState } from "react";
import { CircularProgressbarWithChildren as CircularProgressbar } from "react-circular-progressbar";
import Translated from "../translated";
import style from "./style.module.scss";
import "./custom.css";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface Props {
  start: number;
  onEnd: () => void;
}

const CircularSecondsCountDown: FunctionComponent<Props> = ({
  start,
  onEnd,
}) => {
  const [seconds, setSeconds] = useState(start);
  const [startDate] = useState(() => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + start + 2);
    return date;
  });
  function tick() {
    const left_now = Math.max(0, startDate.getTime() - new Date().getTime());
    const total_seconds = Math.ceil(left_now / 1000);
    const total_seconds_today = total_seconds % 86400;
    const seconds_left = total_seconds_today % 3600;
    const seconds = seconds_left % 60;
    setSeconds(seconds - 1);
    if (seconds === 0) {
      onEnd();
    }
  }
  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={style["seconds-container"]}>
      <CircularProgressbar minValue={0} maxValue={20} value={seconds}>
        <div className={style.number}>
          {Number(pad(seconds)) > 0 ? pad(Math.ceil(seconds)) : 0}{" "}
        </div>
        <div className={style.name}>{Translated.byKey("seconds")}</div>
      </CircularProgressbar>
    </div>
  );
};
export { CircularSecondsCountDown };
