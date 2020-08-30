import React from "react";

export function TimestampString(time: string) : string {
  const d = new Date(time);

  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const year = d.getFullYear().toString();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");

  return [year, month, day].join("-") + " " + [hours, minutes, seconds].join(":");
}

export function Timestamp(props: { time: string }) {
  return <>{TimestampString(props.time)}</>;
}