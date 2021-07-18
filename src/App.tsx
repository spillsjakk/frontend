import React, { Component } from "react";
import Main from "./Main";
import { Container } from "react-bootstrap";
import { NavigationBar } from "./containers/navigation-bar/index";
import LangContext from "./components/LangContext";
import { UserContext, UserContextDataType } from "./components/UserContext";
import { fetchJson } from "./functions";
import GameNotifier from "./components/GameNotifier";
import { WithTheme } from "./hocs/with-theme";
import { WithNotification } from "./hocs/with-notification";
import "./index.css";

type AppState = {
  lang: string;
  user: UserContextDataType;
};

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      lang: localStorage.getItem("lang") ?? "EN",
      user: {
        authenticated: null,
      },
    };
  }

  componentDidMount() {
    fetchJson("/s/account/auth-info", "GET", undefined, (data) =>
      this.setState({ user: data })
    );
  }

  render() {
    const setLangWithLocalStorage = (newLang: string) => {
      this.setState({ lang: newLang });
      localStorage.setItem("lang", newLang);
    };
    const langProviderValue = {
      lang: this.state.lang,
      setLang: setLangWithLocalStorage,
    };
    const userProviderValue = {
      user: this.state.user,
      setUser: (u: UserContextDataType) => this.setState({ user: u }),
    };
    return (
      <WithTheme>
        <WithNotification>
          <LangContext.Provider value={langProviderValue}>
            <UserContext.Provider value={userProviderValue}>
              <NavigationBar />
              <Container id="main-container">
                <GameNotifier />
                <Container id="content-container">
                  <Main />
                </Container>
              </Container>
            </UserContext.Provider>
          </LangContext.Provider>
        </WithNotification>
      </WithTheme>
    );
  }
}

export default App;
