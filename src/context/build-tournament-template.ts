import React, { Context, useContext } from "react";

export interface Option {
  name: string;
  value: number;
}

export interface TemplateContext {
  selectedTemplate: number;
  templates: Array<Option>;
  onSelect: (value: number) => void;
  placeholder: Option;
}

const initalValues = {
  selectedTemplate: 0,
  templates: [{ name: "", value: 0 }],
  onSelect: (value: number) => {},
  placeholder: { name: "", value: 0 },
};

const TemplateContext: Context<TemplateContext> =
  React.createContext(initalValues);

export const TemplateProvider = TemplateContext.Provider;
export default TemplateContext;
export const useTemplate = () => useContext(TemplateContext);
