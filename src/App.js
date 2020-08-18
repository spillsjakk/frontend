import React from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';
import LogoFooter from './components/LogoFooter';
import LangContext from './components/LangContext';

function App() {
  let lang = localStorage.getItem("lang") ?? "EN";
  return (
    <>
      <LangContext.Provider value={lang}>
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
