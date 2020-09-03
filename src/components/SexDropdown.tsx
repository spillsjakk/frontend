import React, { ChangeEvent } from "react";
export default function SexDropdown(props: {
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
    <option value="M">M</option>
    <option value="F">F</option>
  </select>
}