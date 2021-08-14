import React, { FunctionComponent, useState } from "react";

export function numToSquare(num: number) {
  const file = "abcdefgh"[num % 8];
  const rank = Math.floor(num / 8) + 1;
  return file + rank.toString();
}

type ClockState = {
  cache: number;
  checkpoint: Date;
  current: number;
};

const Clock: FunctionComponent<ClockState> = () => {
  const [cache, setCache] = useState(0);
  const [checkpoint, setCheckPoint] = useState(new Date());
  const [current, setCurrent] = useState(0);

  (function tick() {
    setCurrent(cache - (new Date().getTime() - checkpoint.getTime()) / 1000);
  })();

  (function updateAndCache(t) {
    setCache(t);
    setCurrent(t);
  })();

  (function check() {
    setCheckPoint(new Date());
  })();

  const total_seconds = Math.max(0, current);
  const hours_f = total_seconds / 3600;
  const hours = Math.floor(hours_f);
  const seconds_left = total_seconds % 3600;
  const minutes_f = seconds_left / 60;
  const minutes = Math.floor(minutes_f);
  const seconds = Math.floor(seconds_left % 60);

  if (hours !== 0) {
    return (
      <>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </>
    );
  } else {
    return (
      <>
        &nbsp;{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}&nbsp;
      </>
    );
  }
};

export { Clock };
