import React, { FunctionComponent, useState } from "react";
import { Dropdown } from "../../components/dropdown";

interface Props {}

const SelectTemplate: FunctionComponent<Props> = () => {
  const options = [{ name: "", value: "" }];
  return (
    <>
      <Dropdown options={options} onSelect={() => null} />
    </>
  );
};
export { SelectTemplate };
