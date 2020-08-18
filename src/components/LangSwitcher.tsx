import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";

import LangContext from './LangContext';

const LangSwitcher = () => {
  const { lang, setLang } = useContext(LangContext);
  const otherLang = lang === "EN" ? "NO" : "EN";
  return (
    <Dropdown>
      <Dropdown.Toggle>
        { lang }
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setLang(otherLang)}>
          { otherLang }
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LangSwitcher;