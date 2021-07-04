import React, { Context, useContext } from "react";

export interface Option {
  name: string;
  id: string;
}

export interface TemplateContext {
  selectedTemplate: string;
  templates: Array<Option>;
  savedTournaments: Array<any>;
  onSelect: (value: any) => void;
  placeholder: Option;
}

const initalValues = {
  selectedTemplate: "0",
  templates: [{ name: "", id: "0" }],
  savedTournaments: [],
  onSelect: (value: any) => {},
  placeholder: { name: "", id: "0" },
};

const TemplateContext: Context<TemplateContext> =
  React.createContext(initalValues);

export const TemplateProvider = TemplateContext.Provider;
export default TemplateContext;
export const useTemplate = () => useContext(TemplateContext);
