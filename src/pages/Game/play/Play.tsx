/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
import React, { Component, RefObject, PureComponent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../../components/Translated";
import { UserInfoBox } from "./user-info-box";
import { RouteComponentProps } from "react-router-dom";
import { fetchJson, title } from "../../../functions";
import "react-chessground/dist/styles/chessground.css";
import "./Play.css";
import "../chessground-theme.css";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Chess as OpsChess } from "chessops";
import { parseFen } from "chessops/fen";
import { chessgroundDests } from "chessops/compat";
import { Howl } from "howler";
import { Modal, Button } from "react-bootstrap";

export function numToSquare(num: number) {
  const file = "abcdefgh"[num % 8];
  const rank = Math.floor(num / 8) + 1;
  return file + rank.toString();
}

type ClockState = {
  cache: number;
  checkpoint: Date;
  current: number;
};

class Clock extends PureComponent<{}, ClockState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      cache: 0,
      checkpoint: new Date(),
      current: 0,
    };

    this.tick = this.tick.bind(this);
    this.updateAndCache = this.updateAndCache.bind(this);
    this.check = this.check.bind(this);
  }

  tick() {
    this.setState({
      current:
        this.state.cache -
        (new Date().getTime() - this.state.checkpoint.getTime()) / 1000,
    });
  }

  updateAndCache(t: number) {
    this.setState({ cache: t, current: t });
  }

  check() {
    this.setState({ checkpoint: new Date() });
  }

  render() {
    const total_seconds = Math.max(0, this.state.current);
    const hours_f = total_seconds / 3600;
    const hours = Math.floor(hours_f);
    const seconds_left = total_seconds % 3600;
    const minutes_f = seconds_left / 60;
    const minutes = Math.floor(minutes_f);
    const seconds = Math.floor(seconds_left % 60);
    if (total_seconds < 10) {
      const fraction = total_seconds - Math.floor(total_seconds);
      const tenths = Math.floor(fraction * 10);
      var tenthsStr = "." + tenths.toString();
    } else {
      var tenthsStr = "";
    }
    if (hours != 0) {
      return (
        <>
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </>
      );
    } else if (tenthsStr === "") {
      return (
        <>
          &nbsp;{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}&nbsp;
        </>
      );
    } else {
      return (
        <>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
          {tenthsStr}
        </>
      );
    }
  }
}

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
  blackId: string;
  blackName: string;
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
};

class Play extends Component<RouteComponentProps<PlayProps>, PlayState> {
  gameId: string;
  groundRef: RefObject<typeof Chessground>;
  whiteClockRef: RefObject<Clock>;
  blackClockRef: RefObject<Clock>;
  moveTableRef: RefObject<HTMLTableElement>;
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
      blackId: "",
      blackName: "",
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
    };
    this.groundRef = React.createRef();
    this.whiteClockRef = React.createRef();
    this.blackClockRef = React.createRef();
    this.moveTableRef = React.createRef();
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
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-Play";

    this.setState({ clocksInterval: window.setInterval(this.clockTick, 100) });

    this.connect();

    fetchJson(`/s/game/play/${this.gameId}`, "GET", undefined, (json) => {
      if (
        json.redirect ||
        (json.game_info && json.game_info.outcome !== null)
      ) {
        this.props.history.replace("/game/view/" + this.gameId);
        return;
      }

      fetchJson(
        `/s/game/accounts/info?white=${json.game_info.white}&black=${json.game_info.black}`,
        "GET",
        undefined,
        (json) => {
          this.setState({
            white_fide_federation: json.white_fide_federation,
            black_fide_federation: json.black_fide_federation,
          });
        }
      );

      this.setState({
        isPlayer: json.is_player,
        myColor: json.my_color,
        orientation: json.my_color ? json.my_color : "white",
        whiteId: json.game_info.white,
        whiteName: json.game_info.white_name,
        blackId: json.game_info.black,
        blackName: json.game_info.black_name,
      });
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.clocksInterval);
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

      newState.clocksRunning =
        !data.finished && atob(data.moves).length / 3 > 1;
      newState.lastMove = lastMove;
      newState.turn = game.turn() === "w" ? "white" : "black";

      const opsGame = OpsChess.fromSetup(
        parseFen(newState.fen).unwrap()
      ).unwrap();

      newState.check = opsGame.isCheck();

      this.whiteClockRef.current?.updateAndCache(data.wc);
      this.blackClockRef.current?.updateAndCache(data.bc);
      if (game.turn() === "w") {
        this.whiteClockRef.current?.check();
      } else {
        this.blackClockRef.current?.check();
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
      // eslint-disable-next-line no-unused-expressions
      this.moveTableRef.current?.scrollIntoView(false);
    } else if (data.t === "draw") {
      if (data.vote === "yes") {
        if (!this.state.pendingDrawOffer) {
          this.setState({ pendingDrawOffer: 2, showDrawConfirm: true });
        }
      } else {
        this.setState({ pendingDrawOffer: 0, showDrawConfirm: false });
      }
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
      fetchJson(
        `/s/game/move/${this.gameId}/${source}/${target}`,
        "POST",
        undefined,
        (_) => {}
      );
    } else {
      this.setState({
        isPromoting: true,
        promotionTempSource: source,
        promotionTempTarget: target,
      });
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

  doPromotion(which: string) {
    fetchJson(
      `/s/game/move/${this.gameId}/${this.state.promotionTempSource}/${this.state.promotionTempTarget}?promotion=${which}`,
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
    this.setState({ showResignConfirm: true });
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
      this.setState({ showDrawConfirm: true });
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

  secondsToString(total_seconds: number) {
    const hours_f = total_seconds / 3600;
    const hours = Math.floor(hours_f);
    const seconds_left = total_seconds % 3600;
    const minutes_f = seconds_left / 60;
    const minutes = Math.floor(minutes_f);
    const seconds = Math.floor(seconds_left % 60);
    if (total_seconds < 10) {
      const fraction = total_seconds - Math.floor(total_seconds);
      const tenths = Math.floor(fraction * 10);
      // eslint-disable-next-line no-var
      var tenthsStr = "." + tenths.toString();
    } else {
      // eslint-disable-next-line no-var
      var tenthsStr = "";
    }
    if (hours != 0) {
      return (
        hours.toString() +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0")
      );
    } else if (tenthsStr === "") {
      return (
        "&nbsp;" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0") +
        "&nbsp;"
      );
    } else {
      return (
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0") +
        tenthsStr
      );
    }
  }

  clockTick() {
    if (this.state.clocksRunning) {
      const side = this.state.game.turn();
      const clockRef = (side === "w" ? this.whiteClockRef : this.blackClockRef)
        .current!;
      clockRef.tick();
      const newTime = clockRef.state.current;
      if (newTime < 0 && this.state.isPlayer) {
        fetchJson(
          `/s/game/move/${this.gameId}/flag/flag`,
          "POST",
          undefined,
          (_) => {}
        );
      }
    }
  }

  getOpponentInfo() {
    return this.state.orientation === "black"
      ? {
          id: this.state.whiteId,
          name: this.state.whiteName,
        }
      : {
          id: this.state.blackId,
          name: this.state.blackName,
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

  renderOpponentBox() {
    const opponent = this.getOpponentInfo();
    return (
      <UserInfoBox
        federation={
          opponent.id === this.state.whiteId
            ? this.state.white_fide_federation
            : this.state.black_fide_federation
        }
        id={opponent.id}
        name={opponent.name}
      />
    );
  }

  renderSelfBox() {
    const player = this.getSelfInfo();
    return (
      <UserInfoBox
        federation={
          player.id === this.state.whiteId
            ? this.state.white_fide_federation
            : this.state.black_fide_federation
        }
        id={player.id}
        name={player.name}
      />
    );
  }

  render() {
    const splitMovePgn = this.state.pgn.trim().split(" ");
    const rows = [];
    if (this.state.pgn !== "") {
      for (let i = 0; i < splitMovePgn.length; i += 3) {
        rows.push(
          <tr key={i}>
            <td>{splitMovePgn[i]}</td>
            <td className={!splitMovePgn[i + 2] ? "highlight-blue" : undefined}>
              {splitMovePgn[i + 1]}
            </td>
            <td
              className={
                !splitMovePgn[i + 3] && splitMovePgn[i + 2]
                  ? "highlight-blue"
                  : undefined
              }
            >
              {splitMovePgn[i + 2]}
            </td>
          </tr>
        );
      }
    }

    return (
      <>
        <Helmet>
          <title>{title("playGame")}</title>
        </Helmet>

        <div className="mt-5"></div>

        {this.state.isPromoting && (
          <div className="d-flex flex-row justify-content-around">
            <div id="promotion-dialog">
              <img
                src="/images/pieces/wQ.svg"
                onClick={() => this.doPromotion("q")}
              />
              <img
                src="/images/pieces/wR.svg"
                onClick={() => this.doPromotion("r")}
              />
              <img
                src="/images/pieces/wB.svg"
                onClick={() => this.doPromotion("b")}
              />
              <img
                src="/images/pieces/wN.svg"
                onClick={() => this.doPromotion("n")}
              />
              <span onClick={this.cancelPromotion}>X</span>
            </div>
          </div>
        )}

        <div className="d-flex flex-row justify-content-between">
          <div id="move-div">
            <table id="move-table" ref={this.moveTableRef}>
              <tbody>{rows}</tbody>
            </table>
          </div>

          <div className="d-flex flex-column play-box">
            <div className="d-flex flex-row user-box">
              {this.renderOpponentBox()}
            </div>
            <div className="d-flex flex-row">
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
                premovable={{ enabled: false }}
                lastMove={this.state.lastMove}
                check={this.state.check}
              />
            </div>
            <div className="d-flex flex-row user-box">
              {this.renderSelfBox()}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between">
            {this.state.orientation === "black" ? (
              <>
                <div
                  className={
                    "clock" + (this.state.turn === "white" ? " running" : "")
                  }
                >
                  <Clock ref={this.whiteClockRef} />
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    "clock" + (this.state.turn === "black" ? " running" : "")
                  }
                >
                  <Clock ref={this.blackClockRef} />
                </div>
              </>
            )}

            {this.state.isPlayer && this.state.outcome === GameOutcome.Ongoing && (
              <>
                <div className="btn-container">
                  <a
                    className="btn btn-primary"
                    id="resign-btn"
                    onClick={this.resignFirst}
                  >
                    <Translated str="resign" />
                  </a>
                  {this.state.showResignConfirm && (
                    <div className="mt-4">
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

                <div className="btn-container">
                  <a
                    className="btn btn-primary"
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
                    <div className="mt-4">
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
              </>
            )}

            {this.state.orientation === "black" ? (
              <>
                <div
                  className={
                    "clock" + (this.state.turn === "black" ? " running" : "")
                  }
                >
                  <Clock ref={this.blackClockRef} />
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    "clock" + (this.state.turn === "white" ? " running" : "")
                  }
                >
                  <Clock ref={this.whiteClockRef} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-5" id="game-result-div">
          {this.state.outcome !== GameOutcome.Ongoing &&
            (this.state.outcome === GameOutcome.WhiteWins ? (
              <Translated str="whiteWins" />
            ) : this.state.outcome === GameOutcome.BlackWins ? (
              <Translated str="blackWins" />
            ) : (
              <Translated str="itsADraw" />
            ))}
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
              onClick={() => this.setState({ showOutcomePopup: false })}
            >
              {Translated.byKey("reviewGame")}
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.assign("/game/lobby")}
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
