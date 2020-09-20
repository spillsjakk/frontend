import React, { Context, useContext } from "react";
import { Option } from "../components/dropdown/interface";

export interface TemplateContext {
  selectedTemplate: string;
  templates: Array<Option>;
  onSelect: (value: string) => void;
  placeholder: Option;
}

const initalValues = {
  selectedTemplate: "",
  templates: [{ name: "", value: "" }],
  onSelect: (value: string) => {},
  placeholder: { name: "", value: "" },
};

const TemplateContext: Context<TemplateContext> = React.createContext(
  initalValues
);

export const TemplateProvider = TemplateContext.Provider;
export default TemplateContext;
export const useTemplate = () => useContext(TemplateContext);
