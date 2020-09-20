import React, { FunctionComponent, useCallback } from "react";
import { Dropdown } from "../../components/dropdown";

interface Props {}

const SelectTemplate: FunctionComponent<Props> = () => {
  const options = [
    { name: "90 minutes", value: "0" },
    { name: "15 minutes", value: "1" },
    { name: "3 minutes", value: "2" },
  ];

  const onSelect = useCallback((value: string) => {
    console.log(`${value} is selected`);
  }, []);

  return (
    <>
      <Dropdown
        options={options}
        onSelect={onSelect}
        placeholder="Please Select a Template"
      />
    </>
  );
};
export { SelectTemplate };
