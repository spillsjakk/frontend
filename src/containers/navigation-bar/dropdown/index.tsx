import React, { FunctionComponent, useState } from "react";
import { Option } from "./interface";

interface Props {
  options: Array<Option>;
  onSelect: (value: string) => void;
}

const Dropdown: FunctionComponent<Props> = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState(
    Array.isArray(options) ? options[0].value : 0
  );
  return (
    <select
      value={selectedValue}
      onChange={(e) => {
        onSelect(e.target.value);
        setSelectedValue(e.target.value);
      }}
    >
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
