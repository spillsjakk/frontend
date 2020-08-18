import React from "react";

const LangContext = React.createContext({
  lang: "EN",
  setLang: () => {}
});

export default LangContext;