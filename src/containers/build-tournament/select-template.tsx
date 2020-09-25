import React, { FunctionComponent } from "react";
import { useTemplate } from "../../context/build-tournament-template";
import { Dropdown } from "../../components/dropdown";
import "./index.css";

const SelectTemplate: FunctionComponent<{}> = () => {
  const { templates, onSelect, placeholder } = useTemplate();

  return (
    <div id="select-template">
      <Dropdown
        options={templates}
        onSelect={onSelect}
        placeholder={placeholder}
      />
    </div>
  );
};
export { SelectTemplate };
