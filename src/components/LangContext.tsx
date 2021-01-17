import React, { useContext } from "react";

const LangContext = React.createContext({
  lang: "EN",
  setLang: (_: string) => {},
});

export const useLang = () => useContext(LangContext);

export default LangContext;
