import React, { useState, Component } from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';
import LogoFooter from './components/LogoFooter';
import LangContext from './components/LangContext';
import { UserContext, UserContextDataType } from './components/UserContext';

import { fetchJson } from './functions';
import GameNotifier from './components/GameNotifier';

type AppState = {
  lang: string,
  user: UserContextDataType
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      lang: localStorage.getItem("lang") ?? "EN",
      user: {
        authenticated: false
      }
    };
  }

  componentDidMount() {
    fetchJson("/s/account/auth-info", "GET", undefined, data => this.setState({ user: data }));
  }

  render() {
    const setLangWithLocalStorage = (newLang: string) => {
      this.setState({ lang: newLang });
      localStorage.setItem("lang", newLang);
    };
    const langProviderValue = { lang: this.state.lang, setLang: setLangWithLocalStorage };
    const userProviderValue = { user: this.state.user, setUser: (u: UserContextDataType) => this.setState({ user: u })};
    return (
      <>
        <LangContext.Provider value={langProviderValue}>
          <UserContext.Provider value={userProviderValue}>
            <Container id="main-container">
              <Menu />
              <GameNotifier />
              <Container id="content-container">
                <Main />
              </Container>
            </Container>
          </UserContext.Provider>
        </LangContext.Provider>
        <LogoFooter />
      </>
    );
  }
}

export default App;
