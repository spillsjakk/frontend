import React from "react";

const LangContext = React.createContext({
  lang: "EN",
  setLang: (_: string) => {}
});

export default LangContext;