import React, { useContext } from "react";

import LangContext from "./LangContext";

const LangSwitcher = () => {
  const { lang, setLang } = useContext(LangContext);
  const otherLang = lang === "EN" ? "NO" : "EN";
  return (
    <div className="link">
      {lang}
      <div className="menu">
        <a href="#" onClick={() => setLang(otherLang)} className="item">
          {otherLang}
        </a>
      </div>
    </div>
  );
};

export default LangSwitcher;
