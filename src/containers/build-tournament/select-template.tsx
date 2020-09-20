import React, { FunctionComponent } from "react";
import { useTemplate } from "../../context/build-tournament-template";
import { Dropdown } from "../../components/dropdown";

const SelectTemplate: FunctionComponent<{}> = () => {
  const { templates, onSelect, placeholder } = useTemplate();

  return (
    <>
      <Dropdown
        options={templates}
        onSelect={onSelect}
        placeholder={placeholder}
      />
    </>
  );
};
export { SelectTemplate };
