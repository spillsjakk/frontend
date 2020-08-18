import React, { useState } from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';
import LogoFooter from './components/LogoFooter';
import LangContext from './components/LangContext';

function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") ?? "EN");
  const setLangWithLocalStorage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };
  const langProviderValue = { lang, setLang: setLangWithLocalStorage };
  return (
    <>
      <LangContext.Provider value={langProviderValue}>
        <Container id="main-container">
          <Menu />
          <Container id="content-container">
            <Main />
          </Container>
        </Container>
      </LangContext.Provider>
      <LogoFooter />
    </>
  );
}

export default App;
