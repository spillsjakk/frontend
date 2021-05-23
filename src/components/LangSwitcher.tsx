import { MenuItem, Menu } from "@material-ui/core";
import React, { useContext, useState } from "react";

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

const MobileLangSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useContext(LangContext);
  const otherLang = lang === "EN" ? "NO" : "EN";
  return (
    <div
      className="link"
      id="navigation-lang-icon"
      onClick={() => setOpen(true)}
    >
      {lang}
      <Menu
        anchorEl={document.getElementById("navigation-lang-icon")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={(e: any) => {
          setOpen(false);
          e.stopPropagation();
        }}
      >
        <MenuItem
          onClick={(e) => {
            setOpen(false);
            setLang(otherLang);
            e.stopPropagation();
          }}
        >
          {otherLang}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { LangSwitcher, MobileLangSwitcher };
