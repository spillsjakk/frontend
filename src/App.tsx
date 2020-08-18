import React, { useState, Component } from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';
import LogoFooter from './components/LogoFooter';
import LangContext from './components/LangContext';

type AppState = {
  lang: string
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = { lang: localStorage.getItem("lang") ?? "EN" };
  }

  render() {
    const setLangWithLocalStorage = (newLang: string) => {
      this.setState({ lang: newLang });
      localStorage.setItem("lang", newLang);
    };
    const langProviderValue = { lang: this.state.lang, setLang: setLangWithLocalStorage };
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
}

export default App;
