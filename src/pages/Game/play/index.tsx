/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
import React, { Component, RefObject } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../../components/translated";
import { CircularSecondsCountDown } from "../../../components/circular-seconds-count-down";
import { Link, RouteComponentProps } from "react-router-dom";
import { fetchJson, title, fetchCall } from "../../../functions";
import "react-chessground/dist/styles/chessground.css";
import "./style.scss";
import "../chessground-theme.css";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Chess as OpsChess } from "chessops";
import { parseFen } from "chessops/fen";
import { chessgroundDests } from "chessops/compat";
import { Howl } from "howler";
import { Modal, Button } from "react-bootstrap";
import { GameChat } from "../../../containers/game-chat";
import { WithChatService } from "../../../hocs/with-chat-service";
import { Message } from "../../../context/chat-service";
import { Clock, numToSquare } from "./clock";
import UserLink from "../../../components/UserLink";
import { DRAW_OFFER_SIGN } from "../../../constants";
import { Tournament } from "../../Tournament/Types";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";

type PlayProps = {
  id: string;
};

export enum GameOutcome {
  Ongoing,
  WhiteWins,
  Draw,
  BlackWins,
}

type PlayState = {
  fen: string;
  orientation: "white" | "black";
  myColor?: "white" | "black";
  isPlayer: boolean;
  pendingDrawOffer: number;
  clocksRunning: boolean;
  turn: "white" | "black";
  whiteClock: string;
  blackClock: string;
  isPromoting: boolean;
  promotionTempSource: string;
  promotionTempTarget: string;
  dests: any;
  whiteId: string;
  whiteName: string;
  whiteUserName: string;
  blackId: string;
  blackName: string;
  blackUserName: string;
  pgn: string;
  showResignConfirm: boolean;
  showDrawConfirm: boolean;
  outcome: GameOutcome;
  game: typeof Chess;
  clocksInterval?: number;
  lastMove?: string[];
  check: boolean;
  shapes: any[];
  showOutcomePopup: boolean;
  white_fide_federation: string;
  black_fide_federation: string;
  ws: WebSocket | null;
  premove: boolean;
  premoveData: {
    source: string;
    dest: string;
  };
  tournament?: Tournament;
  showWhiteInitialCountdown: boolean;
  showBlackInitialCountdown: boolean;
  whiteInitialCountdown: number;
  blackInitialCountdown: number;
  whiteCountdownTemp: number;
  blackCountdownTemp: number;
  messages: Array<Message>;
  round: number;
  initialTime: number;
  incrementTime: number;
  tabIndex: number;
  promotionPreference: string | null;
  autoPromotion: boolean;
  flagRequestIsSent: boolean;
};

class Play extends Component<RouteComponentProps<PlayProps>, PlayState> {
  gameId: string;
  groundRef: RefObject<typeof Chessground>;
  whiteClockRef: RefObject<Clock> | undefined;
  blackClockRef: RefObject<Clock> | undefined;
  moveSound: Howl;
  timeout = 250;

  constructor(props: RouteComponentProps<PlayProps>) {
    super(props);

    this.gameId = props.match.params.id;

    this.state = {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      orientation: "white",
      isPlayer: false,
      pendingDrawOffer: 0,
      clocksRunning: false,
      turn: "white",
      whiteClock: "",
      blackClock: "",
      isPromoting: false,
      promotionTempSource: "",
      promotionTempTarget: "",
      dests: chessgroundDests(
        OpsChess.fromSetup(
          parseFen(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          ).unwrap()
        ).unwrap()
      ),
      whiteId: "",
      whiteName: "",
      whiteUserName: "",
      blackId: "",
      blackName: "",
      blackUserName: "",
      pgn: "",
      showResignConfirm: false,
      showDrawConfirm: false,
      outcome: GameOutcome.Ongoing,
      game: new Chess(),
      check: false,
      shapes: [],
      showOutcomePopup: false,
      white_fide_federation: "",
      black_fide_federation: "",
      ws: null,
      premove: false,
      premoveData: {
        source: "",
        dest: "",
      },
      showWhiteInitialCountdown: false,
      showBlackInitialCountdown: false,
      whiteInitialCountdown: 0,
      blackInitialCountdown: 0,
      whiteCountdownTemp: 0,
      blackCountdownTemp: 0,
      messages: [],
      round: 0,
      initialTime: 0,
      incrementTime: 0,
      tabIndex: 0,
      promotionPreference: null,
      autoPromotion: false,
      flagRequestIsSent: false,
    };
    this.groundRef = React.createRef();
    this.moveSound = new Howl({
      src: ["/sounds/move.mp3"],
    });

    this.updateData = this.updateData.bind(this);
    this.onMove = this.onMove.bind(this);
    this.resignFirst = this.resignFirst.bind(this);
    this.resignYes = this.resignYes.bind(this);
    this.resignNo = this.resignNo.bind(this);
    this.drawFirst = this.drawFirst.bind(this);
    this.drawNo = this.drawNo.bind(this);
    this.drawYes = this.drawYes.bind(this);
    this.doPromotion = this.doPromotion.bind(this);
    this.cancelPromotion = this.cancelPromotion.bind(this);
    this.clockTick = this.clockTick.bind(this);
    this.getWhoWon = this.getWhoWon.bind(this);
    this.getOpponentInfo = this.getOpponentInfo.bind(this);
    this.getSelfInfo = this.getSelfInfo.bind(this);
    this.renderOpponentBox = this.renderOpponentBox.bind(this);
    this.renderSelfBox = this.renderSelfBox.bind(this);
    this.check = this.check.bind(this);
    this.connect = this.connect.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.TabPanel = this.TabPanel.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(e) {
    if (e.keyCode === 81) {
      this.setState({ promotionPreference: "q", autoPromotion: true });
    } else if (e.keyCode === 82) {
      this.setState({ promotionPreference: "r", autoPromotion: true });
    } else if (e.keyCode === 66) {
      this.setState({ promotionPreference: "b", autoPromotion: true });
    } else if (e.keyCode === 78) {
      this.setState({ promotionPreference: "n", autoPromotion: true });
    } else if (e.keyCode === 88) {
      // x
      this.setState({ promotionPreference: null, autoPromotion: false });
    }
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-Play";

    document.addEventListener("keydown", this.onKeyPress);

    this.setState({ clocksInterval: window.setInterval(this.clockTick, 100) });

    const pngArea = document.getElementsByClassName("png-area")[0];
    if (pngArea) pngArea.scrollLeft += pngArea.scrollWidth;

    fetchJson(`/s/game/play/${this.gameId}`, "GET", undefined, (json) => {
      if (
        json.redirect ||
        (json.game_info && json.game_info.outcome !== null)
      ) {
        this.props.history.replace("/game/view/" + this.gameId);
        return;
      }

      fetchJson(
        `/s/game/${this.gameId}/accounts/info?white=${json.game_info.white}&black=${json.game_info.black}`,
        "GET",
        undefined,
        (json) => {
          if (json) {
            this.setState({
              white_fide_federation: json.white_fide_federation,
              black_fide_federation: json.black_fide_federation,
              tournament: json.tournament,
            });
          }
        }
      );

      this.setState({
        isPlayer: json.is_player,
        myColor: json.my_color,
        orientation: json.my_color ? json.my_color : "white",
        whiteId: json.game_info.white,
        whiteName: json.game_info.white_name,
        whiteUserName: json.game_info.white_username,
        blackId: json.game_info.black,
        blackName: json.game_info.black_name,
        blackUserName: json.game_info.black_username,
        round: json.game_info.round,
        initialTime: json.game_info.initial_time,
        incrementTime: json.game_info.increment,
      });

      this.whiteClockRef = React.createRef();
      this.blackClockRef = React.createRef();

      this.connect();
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.clocksInterval);
    document.removeEventListener("keydown", this.onKeyPress);
    this.state?.ws?.close();
  }

  connect = () => {
    const ws = new WebSocket(
      "wss://" + window.location.host + "/socket/" + this.gameId
    );
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this; // cache the this
    let connectInterval: any;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      this.updateData(JSON.parse(evt.data));
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; // increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); // call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err: any) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); // check if websocket instance is closed, if so call `connect` function.
  };

  reconstructGame(b64moves: string) {
    const game = new Chess();
    const bstr = atob(b64moves);
    let lastMove;
    for (let i = 0; i < bstr.length; i += 3) {
      if (bstr.charCodeAt(i) === 97) {
        // draw offer
        game.set_comment(DRAW_OFFER_SIGN);
        continue;
      }
      const from = numToSquare(bstr.charCodeAt(i));
      const to = numToSquare(bstr.charCodeAt(i + 1));
      let prom: string | null = "-nbrq"[bstr.charCodeAt(i + 2)];
      if (prom === "-") {
        prom = null;
      }
      game.move({ from: from, to: to, promotion: prom });
      lastMove = [from, to];
    }

    return [game, lastMove];
  }

  updateData(data: any) {
    if (data.t === "game") {
      const newState: any = {};

      const [game, lastMove] = this.reconstructGame(data.moves);
      newState.game = game;
      newState.pgn = game
        .pgn()
        .replace(/N/g, "♞")
        .replace(/B/g, "♝")
        .replace(/R/g, "♜")
        .replace(/Q/g, "♛")
        .replace(/K/g, "♚");
      newState.fen = game.fen();

      if (newState.fen !== this.state.fen && data.moves.length > 0) {
        this.moveSound.play();
      }

      newState.clocksRunning = !data.finished; // && atob(data.moves).length / 3 > 1;
      newState.lastMove = lastMove;
      newState.turn = game.turn() === "w" ? "white" : "black";

      const opsGame = OpsChess.fromSetup(
        parseFen(newState.fen).unwrap()
      ).unwrap();

      newState.check = opsGame.isCheck();

      const wc = data.wc - (data.wic > 0 ? 20 : 0);
      const bc = data.bc - (data.bic > 0 ? 20 : 0);

      newState.whiteCountdownTemp = wc;
      newState.blackCountdownTemp = bc;
      if (newState.turn === "white" && data.wic > 0) {
        newState.showWhiteInitialCountdown = true;
        newState.whiteInitialCountdown = data.wic;
        if (this.blackClockRef) {
          this.blackClockRef.current?.updateAndCache(bc);
        }
      } else if (newState.turn === "black" && data.bic > 0) {
        this.setState(
          {
            showWhiteInitialCountdown: false,
            showBlackInitialCountdown: true,
            blackInitialCountdown: data.bic,
            turn: newState.turn,
          },
          () => {
            if (this.whiteClockRef) {
              this.whiteClockRef.current?.updateAndCache(wc);
              this.whiteClockRef.current?.check();
            }
          }
        );
      } else if (this.whiteClockRef && this.blackClockRef) {
        if (this.state.showBlackInitialCountdown) {
          this.setState(
            { showBlackInitialCountdown: false, turn: newState.turn },
            () => {
              if (this.blackClockRef && this.whiteClockRef) {
                this.whiteClockRef.current?.updateAndCache(wc);
                this.blackClockRef.current?.updateAndCache(bc);
                if (game.turn() === "w") {
                  this.whiteClockRef.current?.check();
                } else {
                  this.blackClockRef.current?.check();
                }
              }
            }
          );
        } else {
          this.whiteClockRef.current?.updateAndCache(wc);
          this.blackClockRef.current?.updateAndCache(bc);
          if (game.turn() === "w") {
            this.whiteClockRef.current?.check();
          } else {
            this.blackClockRef.current?.check();
          }
        }
      }

      if (!data.finished) {
        newState.dests = chessgroundDests(opsGame);

        if (this.state.isPlayer) {
          if (
            (this.state.turn === this.state.myColor &&
              this.state.pendingDrawOffer === 1) ||
            (this.state.turn !== this.state.myColor &&
              this.state.pendingDrawOffer === 2)
          ) {
            newState.pendingDrawOffer = 0;
            newState.showDrawConfirm = false;
          }
          if (game.insufficient_material()) {
            fetchJson(
              `/s/game/move/${this.gameId}/draw/auto`,
              "POST",
              undefined,
              (_) => {}
            );
          }
        }
      } else {
        if (data.result === 1) {
          newState.outcome = GameOutcome.WhiteWins;
        } else if (data.result === -1) {
          newState.outcome = GameOutcome.BlackWins;
        } else {
          newState.outcome = GameOutcome.Draw;
        }
        if (this.state.isPlayer) {
          newState.showOutcomePopup = true;
        }
      }

      newState.shapes =
        this.groundRef.current?.cg?.state?.drawable?.shapes || [];

      this.setState(newState);
      const pngArea = document.getElementsByClassName("png-area")[0];
      if (pngArea) pngArea.scrollLeft += pngArea.scrollWidth;

      if (this.state.premove) {
        this.onMove(this.state.premoveData.source, this.state.premoveData.dest);
        this.setState({
          premove: false,
          premoveData: { source: "", dest: "" },
        });
      }
    } else if (data.t === "draw") {
      if (data.vote === "yes") {
        if (!this.state.pendingDrawOffer) {
          this.setState({ pendingDrawOffer: 2, showDrawConfirm: true });
        }
      } else {
        this.setState({ pendingDrawOffer: 0, showDrawConfirm: false });
      }
    } else if (data.t === "message") {
      this.setState({
        messages: [
          {
            side: data.side,
            message_id: data.message_id,
          },
          ...this.state.messages,
        ],
      });
    }
  }

  componentDidUpdate() {
    // eslint-disable-next-line no-unused-expressions
    this.groundRef.current?.cg?.setShapes(this.state.shapes);
    window.dispatchEvent(new Event("resize")); // apparently sometimes needed for chessground
  }

  onMove(source: string, target: string) {
    const target_rank = target.substring(2, 1);
    const piece = this.state.game.get(source).type;
    const promoting =
      piece === "p" && (target_rank === "8" || target_rank === "1");

    if (!promoting) {
      fetchCall(
        `/s/game/move/${this.gameId}/${source}/${target}`,
        "POST",
        undefined,
        (_) => {}
      );
    } else {
      if (this.state.autoPromotion) {
        this.doPromotion(this.state.promotionPreference || "q", source, target);
      } else {
        this.setState({
          isPromoting: true,
          promotionTempSource: source,
          promotionTempTarget: target,
        });
      }
    }
  }

  getWhoWon() {
    if (this.state.outcome === GameOutcome.WhiteWins) {
      return Translated.byKey("whiteWon");
    } else if (this.state.outcome === GameOutcome.BlackWins) {
      return Translated.byKey("blackWon");
    } else if (this.state.outcome === GameOutcome.Draw) {
      return Translated.byKey("draw");
    } else {
      return Translated.byKey("finished");
    }
  }

  doPromotion(which: string, source?: string, target?: string) {
    const localSource = source || this.state.promotionTempSource;
    const localTarget = target || this.state.promotionTempTarget;
    fetchJson(
      `/s/game/move/${this.gameId}/${localSource}/${localTarget}?promotion=${which}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ isPromoting: false });
      }
    );
  }

  cancelPromotion() {
    this.setState({ isPromoting: false });
  }

  resignFirst() {
    this.setState({ showResignConfirm: !this.state.showResignConfirm });
  }

  resignYes() {
    fetchJson(
      `/s/game/move/${this.gameId}/resign/resign`,
      "POST",
      undefined,
      (_) => {
        this.setState({ showResignConfirm: false });
      }
    );
  }

  resignNo() {
    this.setState({ showResignConfirm: false });
  }

  drawFirst() {
    if (this.state.pendingDrawOffer !== 1) {
      this.setState({ showDrawConfirm: !this.state.showDrawConfirm });
    }
  }

  drawYes() {
    fetchJson(
      `/s/game/move/${this.gameId}/draw/yes`,
      "POST",
      undefined,
      (_) => {
        this.setState({ showDrawConfirm: false, pendingDrawOffer: 1 });
      }
    );
  }

  drawNo() {
    fetchJson(`/s/game/move/${this.gameId}/draw/no`, "POST", undefined, (_) => {
      this.setState({ showDrawConfirm: false, pendingDrawOffer: 0 });
    });
  }

  clockTick() {
    if (
      this.state.clocksRunning &&
      this.whiteClockRef &&
      this.blackClockRef &&
      !this.state.showBlackInitialCountdown &&
      !this.state.showWhiteInitialCountdown
    ) {
      const side = this.state.game.turn();
      const clockRef = (side === "w" ? this.whiteClockRef : this.blackClockRef)
        .current;
      if (clockRef) {
        clockRef.tick();
        const newTime = clockRef.state.current;
        if (
          newTime < 0 &&
          this.state.isPlayer &&
          !this.state.flagRequestIsSent
        ) {
          this.setState({ flagRequestIsSent: true });
          fetchJson(
            `/s/game/move/${this.gameId}/flag/flag`,
            "POST",
            undefined,
            (_) => {}
          );
        }
      }
    }
  }

  getResult() {
    let text = <Translated str="itsADraw" />;
    if (this.state.outcome === GameOutcome.WhiteWins) {
      text = <Translated str="whiteWins" />;
    } else if (this.state.outcome === GameOutcome.BlackWins) {
      text = <Translated str="blackWins" />;
    }
    return (
      <>
        {this.state.outcome !== GameOutcome.Ongoing && (
          <div id="game-result-div">{text}</div>
        )}
      </>
    );
  }

  getSelfCountdown() {
    return (
      <>
        {this.state.orientation === "black" ? (
          <>
            {this.state.showBlackInitialCountdown && (
              <div className="initial-countdown">
                <CircularSecondsCountDown
                  start={this.state.blackInitialCountdown}
                  onEnd={() => {
                    this.setState({ showBlackInitialCountdown: false }, () => {
                      if (this.whiteClockRef && this.blackClockRef) {
                        this.whiteClockRef.current?.updateAndCache(
                          this.state.whiteCountdownTemp
                        );
                        this.blackClockRef.current?.updateAndCache(
                          this.state.blackCountdownTemp
                        );
                        if (this.state.turn === "white") {
                          this.whiteClockRef.current?.check();
                        } else {
                          this.blackClockRef.current?.check();
                        }
                      }
                    });
                  }}
                />
                <div className="move-text">
                  {Translated.byKey("toMakeFirstMove")}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {this.state.showWhiteInitialCountdown && (
              <div className="initial-countdown">
                <CircularSecondsCountDown
                  start={this.state.whiteInitialCountdown}
                  onEnd={() => {
                    this.setState({ showWhiteInitialCountdown: false }, () => {
                      if (this.whiteClockRef && this.blackClockRef) {
                        this.whiteClockRef.current?.updateAndCache(
                          this.state.whiteCountdownTemp
                        );
                        this.blackClockRef.current?.updateAndCache(
                          this.state.blackCountdownTemp
                        );
                        if (this.state.turn === "white") {
                          this.whiteClockRef.current?.check();
                        } else {
                          this.blackClockRef.current?.check();
                        }
                      }
                    });
                  }}
                />
                <div className="move-text">
                  {Translated.byKey("toMakeFirstMove")}
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  getOpponentCountdown() {
    return (
      <>
        {this.state.orientation === "black" ? (
          <>
            {this.state.showWhiteInitialCountdown && (
              <div className="initial-countdown">
                <CircularSecondsCountDown
                  start={this.state.whiteInitialCountdown}
                  onEnd={() => {
                    this.setState({ showWhiteInitialCountdown: false }, () => {
                      if (this.whiteClockRef && this.blackClockRef) {
                        this.whiteClockRef.current?.updateAndCache(
                          this.state.whiteCountdownTemp
                        );
                        this.blackClockRef.current?.updateAndCache(
                          this.state.blackCountdownTemp
                        );
                        if (this.state.turn === "white") {
                          this.whiteClockRef.current?.check();
                        } else {
                          this.blackClockRef.current?.check();
                        }
                      }
                    });
                  }}
                />
                <div className="move-text">
                  {Translated.byKey("toMakeFirstMove")}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {this.state.showBlackInitialCountdown && (
              <div className="initial-countdown">
                <CircularSecondsCountDown
                  start={this.state.blackInitialCountdown}
                  onEnd={() => {
                    this.setState({ showBlackInitialCountdown: false }, () => {
                      if (this.whiteClockRef && this.blackClockRef) {
                        this.whiteClockRef.current?.updateAndCache(
                          this.state.whiteCountdownTemp
                        );
                        this.blackClockRef.current?.updateAndCache(
                          this.state.blackCountdownTemp
                        );
                        if (this.state.turn === "white") {
                          this.whiteClockRef.current?.check();
                        } else {
                          this.blackClockRef.current?.check();
                        }
                      }
                    });
                  }}
                />
                <div className="move-text">
                  {Translated.byKey("toMakeFirstMove")}
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  getOpponentInfo() {
    return this.state.orientation === "black"
      ? {
          id: this.state.whiteId,
          name: this.state.tournament?.show_only_usernames
            ? this.state.whiteUserName
            : this.state.whiteName,
        }
      : {
          id: this.state.blackId,
          name: this.state.tournament?.show_only_usernames
            ? this.state.blackUserName
            : this.state.blackName,
        };
  }

  getSelfInfo() {
    return this.state.orientation !== "black"
      ? {
          id: this.state.whiteId,
          name: this.state.whiteName,
        }
      : {
          id: this.state.blackId,
          name: this.state.blackName,
        };
  }

  handleTab(event, newValue) {
    this.setState({ tabIndex: newValue });
  }

  TabPanel(props) {
    const { children, tabIndex, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={tabIndex !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {tabIndex === index && (
          <Box p={3} className="tab-panel-container">
            <div className="tab-container">{children}</div>
          </Box>
        )}
      </div>
    );
  }

  renderOpponentBox() {
    const opponent = this.getOpponentInfo();
    const federation =
      opponent.id === this.state.whiteId
        ? this.state.white_fide_federation
        : this.state.black_fide_federation;
    return (
      <>
        <div className="user-info">
          {federation && (
            <img src={`https://drulpact.sirv.com/sp/flags/${federation}.png`} />
          )}
          <div className="name">
            <UserLink id={opponent.id} name={opponent.name} ghost={false} />
          </div>
        </div>
        {this.renderOpponentClock()}
      </>
    );
  }

  renderSelfBox() {
    const player = this.getSelfInfo();
    const federation =
      player.id === this.state.whiteId
        ? this.state.white_fide_federation
        : this.state.black_fide_federation;
    return (
      <>
        <div className="user-info">
          {federation && (
            <img src={`https://drulpact.sirv.com/sp/flags/${federation}.png`} />
          )}
          <div className="name">
            <UserLink id={player.id} name={player.name} ghost={false} />
          </div>
        </div>
        {this.renderSelfClock()}
      </>
    );
  }

  getWhiteClock() {
    if (
      !this.state.showWhiteInitialCountdown &&
      this.state.whiteCountdownTemp - this.state.blackCountdownTemp !== 20
    ) {
      return (
        <div
          className={"clock" + (this.state.turn === "white" ? " running" : "")}
        >
          <Clock ref={this.whiteClockRef} />
        </div>
      );
    }
  }

  getBlackClock() {
    if (
      !this.state.showBlackInitialCountdown &&
      this.state.whiteCountdownTemp - this.state.blackCountdownTemp !== 20
    ) {
      return (
        <div
          className={"clock" + (this.state.turn === "black" ? " running" : "")}
        >
          <Clock ref={this.blackClockRef} />
        </div>
      );
    }
  }

  renderOpponentClock() {
    if (this.state.orientation === "white") {
      return this.getBlackClock();
    } else {
      return this.getWhiteClock();
    }
  }

  renderSelfClock() {
    if (this.state.orientation === "black") {
      return this.getBlackClock();
    } else {
      return this.getWhiteClock();
    }
  }

  render() {
    const splitMovePgn = this.state.pgn.trim().split(" ");
    const rows = [];
    if (this.state.pgn !== "") {
      for (let i = 0; i < splitMovePgn.length; i += 3) {
        rows.push(
          <div key={i} className="item">
            <span>{splitMovePgn[i]}</span>
            <span
              className={!splitMovePgn[i + 2] ? "highlight-blue" : undefined}
            >
              {splitMovePgn[i + 1]}
            </span>
            <span
              className={
                !splitMovePgn[i + 3] && splitMovePgn[i + 2]
                  ? "highlight-blue"
                  : undefined
              }
            >
              {splitMovePgn[i + 2]}
            </span>
          </div>
        );
      }
    }

    return (
      <>
        <Helmet>
          <title>{title("playGame")}</title>
        </Helmet>

        {this.state.isPromoting && (
          <div className="d-flex flex-row justify-content-around">
            <div id="promotion-dialog">
              <img
                src={`https://drulpact.sirv.com/sp/pieces/${
                  this.state.orientation === "black" ? "bQ" : "wQ"
                }.svg`}
                onClick={() => this.doPromotion("q")}
              />
              <img
                src={`https://drulpact.sirv.com/sp/pieces/${
                  this.state.orientation === "black" ? "bR" : "wR"
                }.svg`}
                onClick={() => this.doPromotion("r")}
              />
              <img
                src={`https://drulpact.sirv.com/sp/pieces/${
                  this.state.orientation === "black" ? "bB" : "wB"
                }.svg`}
                onClick={() => this.doPromotion("b")}
              />
              <img
                src={`https://drulpact.sirv.com/sp/pieces/${
                  this.state.orientation === "black" ? "bN" : "wN"
                }.svg`}
                onClick={() => this.doPromotion("n")}
              />
              <span onClick={this.cancelPromotion}>X</span>
            </div>
          </div>
        )}

        <div className="wrapper">
          <Grid container justifyContent="center" spacing={6}>
            <Grid
              container
              justifyContent="end"
              className="board-grid"
              item
              md={12}
              lg={8}
            >
              <div className="board-area">
                <div className="play-box">
                  <div className="user-box">{this.renderOpponentBox()}</div>
                  <Chessground
                    fen={this.state.fen}
                    orientation={this.state.orientation}
                    turnColor={this.state.turn}
                    onMove={this.onMove}
                    ref={this.groundRef}
                    style={
                      this.state.isPromoting && {
                        pointerEvents: "none",
                        filter: "blur(3px)",
                      }
                    }
                    movable={{
                      free: false,
                      color: this.state.myColor,
                      dests: this.state.dests,
                      showDests: true,
                      rookCastle: false,
                    }}
                    premovable={{
                      enabled: true,
                      showDests: true,
                      castle: true,
                      events: {
                        set: (orig: any, dest: any) => {
                          this.setState({
                            premove: true,
                            premoveData: { source: orig, dest },
                          });
                        },
                        unset: () => {
                          this.setState({
                            premove: false,
                            premoveData: { source: "", dest: "" },
                          });
                        },
                      },
                    }}
                    lastMove={this.state.lastMove}
                    check={this.state.check}
                  />
                  <div className="user-box self-box">
                    {this.renderSelfBox()}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid container justifyContent="center" item md={12} lg={4}>
              <div className="info-area">
                {this.getOpponentCountdown()}

                {this.getResult()}
                {!this.state.showBlackInitialCountdown &&
                  !this.state.showWhiteInitialCountdown &&
                  this.state.isPlayer && (
                    <Paper>
                      <Tabs
                        value={this.state.tabIndex}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="icon tabs example"
                        onChange={this.handleTab}
                      >
                        <Tab icon={<MessageIcon />} aria-label="message" />
                        <Tab icon={<SettingsIcon />} aria-label="settings" />
                        <Tab icon={<InfoIcon />} aria-label="info" />
                      </Tabs>
                      <this.TabPanel
                        className="tab-panel"
                        tabIndex={this.state.tabIndex}
                        index={0}
                      >
                        {this.state.tournament &&
                          this.state.tournament.chat_enabled && (
                            <WithChatService
                              messages={this.state.messages}
                              gameId={this.gameId}
                              side={this.state.myColor === "white" ? 0 : 1}
                            >
                              <GameChat color={this.state.myColor} />
                            </WithChatService>
                          )}
                      </this.TabPanel>
                      <this.TabPanel
                        className="tab-panel"
                        tabIndex={this.state.tabIndex}
                        index={1}
                      >
                        <div className="auto-promotion-container">
                          <div className="auto-promotion">
                            <Typography>Automatic Promotion</Typography>
                            <Switch
                              checked={this.state.autoPromotion}
                              onChange={(e) =>
                                this.setState({
                                  autoPromotion: e.target.checked,
                                  promotionPreference: "q",
                                })
                              }
                              inputProps={{
                                "aria-label": "secondary checkbox",
                              }}
                            />
                          </div>
                          {this.state.autoPromotion && (
                            <RadioGroup
                              value={this.state.promotionPreference}
                              onChange={(e) =>
                                this.setState({
                                  promotionPreference: e.target.value,
                                })
                              }
                              className="choices"
                            >
                              <FormControlLabel
                                value="q"
                                control={<Radio />}
                                label="Queen"
                              />
                              <FormControlLabel
                                value="r"
                                control={<Radio />}
                                label="Rook"
                              />
                              <FormControlLabel
                                value="b"
                                control={<Radio />}
                                label="Bishop"
                              />
                              <FormControlLabel
                                value="n"
                                control={<Radio />}
                                label="Knight"
                              />
                            </RadioGroup>
                          )}
                        </div>
                      </this.TabPanel>
                      <this.TabPanel
                        className="tab-panel"
                        tabIndex={this.state.tabIndex}
                        index={2}
                      >
                        <>
                          <div className="tournament-info">
                            {Translated.byKey("round")}: {this.state.round},{" "}
                            {this.state.initialTime}+{this.state.incrementTime}
                          </div>
                          <div className="tournament-link">
                            <Link
                              to={`/tournament/view/${this.state.tournament?.id}`}
                            >
                              {Translated.byKey("backToTournament")}
                            </Link>
                          </div>
                        </>
                      </this.TabPanel>
                    </Paper>
                  )}
                {!this.state.isPlayer && (
                  <>
                    <div className="tournament-info">
                      {Translated.byKey("round")}: {this.state.round},{" "}
                      {this.state.initialTime}+{this.state.incrementTime}
                    </div>
                    <div className="tournament-link">
                      <Link
                        to={`/tournament/view/${this.state.tournament?.id}`}
                      >
                        {Translated.byKey("backToTournament")}
                      </Link>
                    </div>
                  </>
                )}
                {this.state.outcome === GameOutcome.Ongoing &&
                  !this.state.showBlackInitialCountdown &&
                  !this.state.showWhiteInitialCountdown &&
                  this.state.isPlayer && (
                    <div className="buttons-container">
                      <div className="buttons">
                        <a
                          className="action-button"
                          id="resign-btn"
                          onClick={this.resignFirst}
                        >
                          <Translated str="resign" />
                        </a>
                        {this.state.showResignConfirm && (
                          <div className="decide-buttons">
                            <a
                              className="btn btn-danger"
                              id="no-resign-btn"
                              onClick={this.resignNo}
                            >
                              <Translated str="no" />
                            </a>
                            <a
                              className="btn btn-success"
                              id="yes-resign-btn"
                              onClick={this.resignYes}
                            >
                              <Translated str="yes" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="buttons">
                        <a
                          className="action-button"
                          id="draw-btn"
                          onClick={this.drawFirst}
                        >
                          {this.state.pendingDrawOffer === 2 ? (
                            <Translated str="acceptDraw" />
                          ) : this.state.pendingDrawOffer === 1 ? (
                            <Translated str="drawOfferPending" />
                          ) : (
                            <Translated str="offerDraw" />
                          )}
                        </a>
                        {this.state.showDrawConfirm && (
                          <div className="decide-buttons">
                            <a
                              className="btn btn-danger"
                              id="no-draw-btn"
                              onClick={this.drawNo}
                            >
                              <Translated str="no" />
                            </a>
                            <a
                              className="btn btn-success"
                              id="yes-draw-btn"
                              onClick={this.drawYes}
                            >
                              <Translated str="yes" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                {this.getSelfCountdown()}
              </div>
            </Grid>
          </Grid>
          <div className="png-area">
            <div id="move-div">{rows}</div>
          </div>
        </div>

        <Modal
          id="outcome-popup"
          show={this.state.showOutcomePopup}
          onHide={() => this.setState({ showOutcomePopup: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getWhoWon()}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                this.props.history.replace("/game/view/" + this.gameId)
              }
            >
              {Translated.byKey("reviewGame")}
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.assign("/calendar")}
            >
              {Translated.byKey("nextGame")}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Play;
