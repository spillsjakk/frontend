import { MenuItem, Menu } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import LangContext from "./LangContext";

const LangSwitcher = () => {
  const { lang, setLang } = useContext(LangContext);
  const otherLang = lang === "en" ? "NO" : "EN";
  return (
    <div className="link">
      {lang.toUpperCase()}
      <div className="menu">
        <Link
          to="#"
          onClick={() => setLang(otherLang.toLowerCase())}
          className="item"
        >
          {otherLang}
        </Link>
      </div>
    </div>
  );
};

const MobileLangSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useContext(LangContext);
  const otherLang = lang === "en" ? "NO" : "EN";
  return (
    <div
      className="link"
      id="navigation-lang-icon"
      onClick={() => setOpen(true)}
    >
      {lang.toUpperCase()}
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
            setLang(otherLang.toLowerCase());
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
