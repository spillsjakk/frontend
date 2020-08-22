import React, { Component, PureComponent } from "react";
import { Container, Alert } from "react-bootstrap";
import Translated from "./Translated";
import { Link, useHistory, withRouter, RouteComponentProps } from "react-router-dom";
import { fetchJson } from "../functions";
import { UserContext } from "./UserContext";

type GameNotifierState = {
  shouldPlay: boolean
  mayShowNotification: boolean
  gameId: string
  unlisten?: Function
}

class GameNotifier extends PureComponent<RouteComponentProps, GameNotifierState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  interval?: number;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      shouldPlay: false,
      mayShowNotification: true,
      gameId: ""
    };

    this.checkForGame = this.checkForGame.bind(this);
  }

  componentDidMount() {
    this.setState({
      unlisten: this.props.history.listen((location, _) => {
        if (!this.context.user.authenticated) {
          return;
        }

        if (location.pathname === "/game/lobby" || location.pathname === "/game/play/" + this.state.gameId) {
          this.setState({ mayShowNotification: false });
        } else {
          this.setState({ mayShowNotification: true });
          this.checkForGame();
        }
      }),
    }, () => {
      this.checkForGame(true);
      window.setInterval(this.checkForGame, 30000);
    });
  }

  checkForGame(firstTime?: boolean) {
    if (!this.context.user.authenticated && !firstTime) {
      return;
    }

    fetchJson(`/s/game/lobby`, "GET", undefined, result => {
      if (result.authenticated === false) {
        return;
      }

      if (result.next !== -1 && result.next <= 600000) {
        this.setState({
          shouldPlay: true, gameId: result.id,
          mayShowNotification: !(this.props.location.pathname === "/game/lobby" || this.props.location.pathname === "/game/play/" + result.id)
        });
      } else {
        this.setState({ shouldPlay: false, gameId: "" });
      }
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
    this.state.unlisten?.();
  }

  render() {
    if (!this.state.mayShowNotification || !this.state.shouldPlay) {
      return <></>;
    }

    return (
      <Alert variant="warning" className="mt-3" style={{ textAlign: "center" }}>
        <strong>
          <Translated str="aboutToPlay" /> <Link to="/game/lobby"><Translated str="goToLobby" /></Link>
        </strong>
      </Alert >
    );
  }
}

export default withRouter(GameNotifier);