import React, { FunctionComponent } from "react";
import { Option } from "./interface";

interface Props {
  options: Array<Option>;
  onSelect: (value: string) => void;
}

const Dropdown: FunctionComponent<Props> = ({ options, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      {Array.isArray(options) &&
        options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.name}
          </option>
        ))}
    </select>
  );
};
export { Dropdown };
