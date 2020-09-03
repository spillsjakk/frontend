import React, { ChangeEvent } from "react";
export default function TitleDropdown(props: {
  className?: string,
  value?: string,
  name?: string,
  id?: string,
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}) {
  return <select value={props.value}
    onChange={props.onChange}
    className={props.className}
    name={props.name}
    id={props.id}
  >
    <option value="">None</option>
    <option value="GM">GM</option>
    <option value="IM">IM</option>
    <option value="FM">FM</option>
    <option value="CM">CM</option>
    <option value="WGM">WGM</option>
    <option value="WIM">WIM</option>
    <option value="WFM">WFM</option>
    <option value="WCM">WCM</option>
  </select>
}