import React, { FunctionComponent } from "react";
import ReactCountdown from "react-countdown";
import Translated from "../../components/Translated";

interface Props {
  time: string;
}

const Countdown: FunctionComponent<Props> = (props) => {
  return (
    <div>
      <span>
        <Translated str="startsIn" />
      </span>
      <ReactCountdown date={new Date(props.time).getTime()} />
    </div>
  );
};
export { Countdown };
