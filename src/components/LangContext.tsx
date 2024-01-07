import React, { useContext } from "react";

const LangContext = React.createContext({
  lang: "en",
  setLang: (_: string) => {},
});

export const useLang = () => useContext(LangContext);

export default LangContext;
