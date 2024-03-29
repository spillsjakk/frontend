import { NativeSelect } from "@material-ui/core";
import React from "react";
import Translated from "./translated";

export function TiebreakerDropdown(props: {
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: any) => void;
}) {
  return (
    <select
      value={props.value}
      onChange={props.onChange}
      className="w-25"
      name={props.name}
      id={props.id}
    >
      <option value=""></option>
      <option value="0">{Translated.byKey("averageOpponentRating")}</option>
      <option value="1">{Translated.byKey("buchholz")}</option>
      <option value="2">{Translated.byKey("medianBuchholz")}</option>
      <option value="3">{Translated.byKey("medianBuchholz2")}</option>
      <option value="4">{Translated.byKey("buchholzCut1")}</option>
      <option value="5">{Translated.byKey("buchholzCut2")}</option>
    </select>
  );
}

export function TiebreakerDropdownV2(props: {
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: any) => void;
}) {
  return (
    <NativeSelect
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      id={props.id}
      variant="outlined"
      fullWidth
    >
      <option value="">
        {`${Translated.byKey("pleaseSelect")} ${Translated.byKey(
          "tiebreaker"
        )} ${props.id}`}
      </option>
      <option value="0">{Translated.byKey("averageOpponentRating")}</option>
      <option value="1">{Translated.byKey("buchholz")}</option>
      <option value="2">{Translated.byKey("medianBuchholz")}</option>
      <option value="3">{Translated.byKey("medianBuchholz2")}</option>
      <option value="4">{Translated.byKey("buchholzCut1")}</option>
      <option value="5">{Translated.byKey("buchholzCut2")}</option>
    </NativeSelect>
  );
}
