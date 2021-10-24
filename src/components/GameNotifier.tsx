import React, { PureComponent } from "react";
import { Alert } from "react-bootstrap";
import Translated from "./translated";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { fetchJson } from "../functions";
import { UserContext } from "./UserContext";
import { GameNotifierPopup } from "./GameNotifierPopup";

type GameNotifierState = {
  shouldPlay: boolean;
  showGameNotifierPopup: boolean;
  mayShowNotification: boolean;
  gameId: string;
  unlisten?: Function;
};

class GameNotifier extends PureComponent<
  RouteComponentProps,
  GameNotifierState
> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  interval?: number;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      shouldPlay: false,
      showGameNotifierPopup: false,
      mayShowNotification: true,
      gameId: "",
    };

    this.checkForGame = this.checkForGame.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        unlisten: this.props.history.listen((location, _) => {
          if (!this.context.user.authenticated) {
            return;
          }

          if (
            location.pathname === "/calendar" ||
            location.pathname === "/game/play/" + this.state.gameId
          ) {
            this.setState({ mayShowNotification: false });
          } else {
            this.setState({ mayShowNotification: true });
            this.checkForGame();
          }
        }),
      },
      () => {
        this.checkForGame(true);
        window.setInterval(this.checkForGame, 30000);
      }
    );
  }

  checkForGame(firstTime?: boolean) {
    if (!this.context.user.authenticated && !firstTime) {
      return;
    }

    fetchJson(`/s/game/lobby`, "GET", undefined, (result) => {
      if (result.authenticated === false) {
        return;
      }

      if (result.next !== -1 && result.next <= 600000) {
        const gameIdFromLocalStorage = localStorage.getItem(
          "gameNotifierPopupIsShownFor"
        );
        let showGameNotifierPopup;
        if (gameIdFromLocalStorage === result.id) {
          showGameNotifierPopup = false;
        } else {
          showGameNotifierPopup = true;
          localStorage.setItem("gameNotifierPopupIsShownFor", result.id);
        }
        this.setState({
          shouldPlay: true,
          gameId: result.id,
          showGameNotifierPopup,
          mayShowNotification: !(
            this.props.location.pathname === "/calendar" ||
            this.props.location.pathname === "/game/play/" + result.id
          ),
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
      <Alert
        variant="warning"
        className="mt-3"
        style={{
          textAlign: "center",
          position: "sticky",
          top: "75px",
          zIndex: 20,
        }}
      >
        <strong>
          <Translated str="aboutToPlay" />{" "}
          <Link to="/calendar">
            <Translated str="goToLobby" />
          </Link>
          <GameNotifierPopup
            show={this.state.showGameNotifierPopup}
            onClose={() => this.setState({ showGameNotifierPopup: false })}
          />
        </strong>
      </Alert>
    );
  }
}

export default withRouter(GameNotifier);
