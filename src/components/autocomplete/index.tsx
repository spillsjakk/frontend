import React, { FunctionComponent } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete as MAutocomplete } from "@material-ui/lab";

export type Option = { name: string; value: string };

interface Props {
  data: Array<Option>;
  label: string;
  onSelect: (value: Option) => void;
  value: string;
  inputValue: string;
}

const Autocomplete: FunctionComponent<Props> = ({
  data,
  label,
  onSelect,
  value,
  inputValue,
}) => {
  return (
    <>
      <MAutocomplete
        value={value}
        inputValue={inputValue}
        freeSolo
        disableClearable
        options={data}
        getOptionLabel={(option) => option.name || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: "search" }}
          />
        )}
        onChange={(_, newValue) => onSelect(newValue as Option)}
      />
    </>
  );
};

export { Autocomplete };
