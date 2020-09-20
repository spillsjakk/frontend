import React, { FunctionComponent } from "react";
import ReactCountdown from "react-countdown";

interface Props {
  time: string;
}

const Countdown: FunctionComponent<Props> = (props) => {
  return (
    <div>
      <span>Count Down: </span>
      <ReactCountdown date={new Date(props.time).getTime()} />
    </div>
  );
};
export { Countdown };
