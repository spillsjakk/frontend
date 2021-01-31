import React, { PureComponent } from "react";

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

export class Clock extends PureComponent<{}, ClockState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      cache: 0,
      checkpoint: new Date(),
      current: 0,
    };

    this.tick = this.tick.bind(this);
    this.updateAndCache = this.updateAndCache.bind(this);
    this.check = this.check.bind(this);
  }

  tick() {
    this.setState({
      current:
        this.state.cache -
        (new Date().getTime() - this.state.checkpoint.getTime()) / 1000,
    });
  }

  updateAndCache(t: number) {
    this.setState({ cache: t, current: t });
  }

  check() {
    this.setState({ checkpoint: new Date() });
  }

  render() {
    const total_seconds = Math.max(0, this.state.current);
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
  }
}
