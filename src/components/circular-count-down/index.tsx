import React, { FunctionComponent, memo, useEffect, useRef, useState } from "react";
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

function useInterval(callback, delay) {
  const savedCallback: { current: () => void; } = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

interface Props {
  startDate: Date;
}

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
}

const CircularCountDown: FunctionComponent<Props> = ({ startDate }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(Math.ceil((Math.max(0, startDate.getTime() - new Date().getTime()) / 1000)));
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursRemaining = (minutesRemaining - minutesToDisplay) / 60;
  const hoursToDisplay = hoursRemaining % 24;
  const daysRemaining = (hoursRemaining - hoursToDisplay) / 24;
  const daysToDisplay = daysRemaining % 30;


  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      } else {
        setStatus(STATUS.STOPPED)
      }
    },
    status === STATUS.STARTED ? 1000 : null,
    // passing null stops the interval
  )

  useEffect(() => {
    if (secondsRemaining > 0 && status === STATUS.STOPPED) {
      setStatus(STATUS.STARTED);
    }
  }, [secondsRemaining]);

  return (
    <div className={style["countdown-container"]}>
      <div className={style.item}>
        <Circle min={0} max={365} value={daysToDisplay} textKey={"days"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={24} value={hoursToDisplay} textKey={"hours"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={60} value={minutesToDisplay} textKey={"minutes"} />
      </div>
      <div className={style.item}>
        <Circle min={0} max={60} value={secondsToDisplay} textKey={"seconds"} />
      </div>
    </div>
  );
};

export { CircularCountDown };
