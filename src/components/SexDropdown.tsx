import { NativeSelect } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import Translated from "./translated";
export default function SexDropdown(props: {
  className?: string;
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select
      value={props.value}
      onChange={props.onChange}
      className={props.className}
      name={props.name}
      id={props.id}
    >
      <option value="M">M</option>
      <option value="F">F</option>
    </select>
  );
}
export function MuiSexDropdown(props: {
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <NativeSelect
      variant="outlined"
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      id={props.id}
    >
      <option value="" disabled>
        {Translated.byKey("sex")}
      </option>
      <option value="M">M</option>
      <option value="F">F</option>
    </NativeSelect>
  );
}
