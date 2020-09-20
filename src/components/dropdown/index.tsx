import React, { FunctionComponent, useState } from "react";
import { Option } from "./interface";

interface Props {
  options: Array<Option>;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const placeholderValue = "PLACEHOLDER-VALUE";

const Dropdown: FunctionComponent<Props> = ({
  options,
  onSelect,
  placeholder,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    placeholder ? placeholderValue : options[0].value
  );
  return (
    <select
      value={selectedValue}
      onChange={(e) => {
        onSelect(e.target.value);
        setSelectedValue(e.target.value);
      }}
    >
      {placeholder && (
        <option value={placeholderValue} disabled>
          {placeholder}
        </option>
      )}
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
