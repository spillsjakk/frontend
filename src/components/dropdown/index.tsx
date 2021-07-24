import { NativeSelect } from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";

export interface Option {
  name: string;
  value: string;
}

interface Props {
  options: Array<Option>;
  onSelect: (value: string) => void;
  placeholder?: Option;
}

const Dropdown: FunctionComponent<Props> = ({
  options,
  onSelect,
  placeholder,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    placeholder
      ? placeholder.value
      : Array.isArray(options) && options.length
      ? options[0].value
      : ""
  );
  return (
    <NativeSelect
      value={selectedValue}
      variant="outlined"
      onChange={(e) => {
        onSelect(e.target.value as string);
        setSelectedValue(e.target.value as string);
      }}
    >
      {placeholder && (
        <option value={placeholder.value} disabled>
          {placeholder.name}
        </option>
      )}
      {Array.isArray(options) &&
        options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.name}
          </option>
        ))}
    </NativeSelect>
  );
};
export { Dropdown };
