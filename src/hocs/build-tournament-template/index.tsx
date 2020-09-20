import React, { FunctionComponent, useCallback, useState } from "react";
import { TemplateProvider } from "../../context/build-tournament-template";

const templates = [
  { name: "90 minutes", value: "0" },
  { name: "15 minutes", value: "1" },
  { name: "3 minutes", value: "2" },
];

const placeholder = {
  name: "Please Select a Template",
  value: "PLACEHOLDER-VALUE",
};

const WithBuildTournamentTemplate: FunctionComponent = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(placeholder.value);
  const onSelect = useCallback((value: string) => {
    console.log(`${value} is selected`);
    setSelectedTemplate(value);
  }, []);

  return (
    <TemplateProvider
      value={{
        selectedTemplate,
        templates,
        onSelect,
        placeholder,
      }}
    >
      {children}
    </TemplateProvider>
  );
};
export { WithBuildTournamentTemplate };
