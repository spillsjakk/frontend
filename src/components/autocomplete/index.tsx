import React, { FunctionComponent } from "react";
import { TextField, Autocomplete as MAutocomplete } from "@material-ui/core";

export type Option = { name: string; value: string };

interface Props {
  data: Array<Option>;
  label: string;
  onSelect: (value: Option) => void;
  onChange: (value: string) => void;
  value: string;
  inputValue: string;
}

const Autocomplete: FunctionComponent<Props> = ({
  data,
  label,
  onSelect,
  onChange,
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
        onInputChange={(event, newValue) => {
          if (event) onChange(newValue);
        }}
      />
    </>
  );
};

export { Autocomplete };
