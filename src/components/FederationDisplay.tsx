import React from "react";
export default function FederationDisplay(props: {
  className?: string,
  value?: string,
  name?: string,
  id?: string
}) {
  return <>
    {props.value && <>
      <img src={"/images/flags/" + props.value + ".png"} alt={props.value} />&nbsp;
      {props.value}
    </>}
  </>;
}