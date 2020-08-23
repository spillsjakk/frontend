import React, { Component, RefObject, PureComponent } from "react";
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import Translated from "../../components/Translated";
import UserLink from "../../components/UserLink";
import { RouteComponentProps } from "react-router-dom";
import { fetchJson } from '../../functions';
import 'react-chessground/dist/styles/chessground.css';
import './Play.css';
import './chessground-theme.css';
import Websocket from 'react-websocket';
import Chessground from 'react-chessground';
import Chess from 'chess.js';
import { Chess as OpsChess } from 'chessops';
import { parseFen } from 'chessops/fen';
import { chessgroundDests } from "chessops/compat";

export function numToSquare(num: number) {
  let file = "abcdefgh"[num % 8];
  let rank = Math.floor(num / 8) + 1;
  return file + rank.toString();
}

type ClockState = {
  cache: number
  checkpoint: Date
  current: number
}

class Clock extends PureComponent<{}, ClockState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      cache: 0,
      checkpoint: new Date(),
      current: 0
    }

    this.tick = this.tick.bind(this);
    this.updateAndCache = this.updateAndCache.bind(this);
    this.check = this.check.bind(this);
  }

  tick() {
    this.setState({
      current:
        this.state.cache - (new Date().getTime() - this.state.checkpoint.getTime()) / 1000
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
      return <>{hours}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</>;
    } else if (tenthsStr === "") {
      return <>&nbsp;{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}&nbsp;</>;
    } else {
      return <>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}{tenthsStr}</>;
    }
  }
}

type PlayProps = {
  id: string
}

export enum GameOutcome {
  Ongoing,
  WhiteWins,
  Draw,
  BlackWins
}

type PlayState = {
  fen: string
  orientation: "white" | "black"
  myColor?: "white" | "black"
  isPlayer: boolean
  pendingDrawOffer: number
  clocksRunning: boolean
  turn: "white" | "black"
  whiteClock: string
  blackClock: string
  isPromoting: boolean
  promotionTempSource: string
  promotionTempTarget: string
  dests: any
  whiteId: string
  whiteName: string
  blackId: string
  blackName: string
  pgn: string
  showResignConfirm: boolean
  showDrawConfirm: boolean
  outcome: GameOutcome
  game: typeof Chess
  clocksInterval?: number
  lastMove?: string[]
  check: boolean
  shapes: any[]
}

class Play extends Component<RouteComponentProps<PlayProps>, PlayState> {
  gameId: string;
  groundRef: RefObject<typeof Chessground>;
  whiteClockRef: RefObject<Clock>;
  blackClockRef: RefObject<Clock>;
  moveTableRef: RefObject<HTMLTableElement>;

  constructor(props: RouteComponentProps<PlayProps>) {
    super(props);

    this.gameId = props.match.params.id;

    this.state = {
      fen: "8/8/8/8/8/8/8/8 w KQkq - 0 1",
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
      dests: {},
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
      shapes: []
    };
    this.groundRef = React.createRef();
    this.whiteClockRef = React.createRef();
    this.blackClockRef = React.createRef();
    this.moveTableRef = React.createRef();

    this.onWsMessage = this.onWsMessage.bind(this);
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
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-Play";

    this.setState({ clocksInterval: window.setInterval(this.clockTick, 100) });

    fetchJson(`/s/game/play/${this.gameId}`, "GET", undefined, json => {
      if (json.redirect || (json.game_info && json.game_info.outcome !== null)) {
        this.props.history.push("/game/view/" + this.gameId);
        return;
      }

      this.setState({
        isPlayer: json.is_player,
        myColor: json.my_color,
        orientation: json.my_color ? json.my_color : "white",
        whiteId: json.game_info.white,
        whiteName: json.game_info.white_name,
        blackId: json.game_info.black,
        blackName: json.game_info.black_name
      });
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.clocksInterval);
  }

  reconstructGame(b64moves: string) {
    const game = new Chess();
    let bstr = atob(b64moves);
    let lastMove = undefined;
    for (let i = 0; i < bstr.length; i += 3) {
      let from = numToSquare(bstr.charCodeAt(i));
      let to = numToSquare(bstr.charCodeAt(i + 1));
      let prom: string | null = "-nbrq"[bstr.charCodeAt(i + 2)];
      if (prom === "-") {
        prom = null;
      }
      game.move({ "from": from, "to": to, "promotion": prom });
      lastMove = [from, to];
    }

    return [game, lastMove];
  }

  updateData(data: any) {
    if (data.t === "game") {
      const newState: any = {};

      const [game, lastMove] = this.reconstructGame(data.moves);
      newState.game = game;
      newState.pgn = game.pgn().replace(/N/g, "♞").replace(/B/g, "♝").replace(/R/g, "♜").replace(/Q/g, "♛").replace(/K/g, "♚");
      newState.fen = game.fen();
      newState.clocksRunning = !data.finished && atob(data.moves).length / 3 > 1;
      newState.lastMove = lastMove;
      newState.turn = game.turn() === "w" ? "white" : "black";

      const opsGame = OpsChess.fromSetup(parseFen(newState.fen).unwrap()).unwrap();

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
          if ((this.state.turn === this.state.myColor && this.state.pendingDrawOffer === 1)
            || (this.state.turn !== this.state.myColor && this.state.pendingDrawOffer === 2)) {
            newState.pendingDrawOffer = 0;
            newState.showDrawConfirm = false;
          }
          if (game.insufficient_material()) {
            fetchJson(`/s/game/move/${this.gameId}/draw/auto`, "POST", undefined, _ => { });
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
      }

      newState.shapes = this.groundRef.current?.cg?.state?.drawable?.shapes || [];

      this.setState(newState);
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
    this.groundRef.current?.cg?.setShapes(this.state.shapes);
  }

  onWsMessage(msg: string) {
    const data = JSON.parse(msg);
    this.updateData(data);
  }

  onMove(source: string, target: string) {
    let target_rank = target.substring(2, 1);
    let piece = this.state.game.get(source).type;
    let promoting = piece === "p" && (target_rank === "8" || target_rank === "1");

    if (!promoting) {
      fetchJson(`/s/game/move/${this.gameId}/${source}/${target}`, "POST", undefined, _ => { });
    } else {
      this.setState({
        isPromoting: true,
        promotionTempSource: source,
        promotionTempTarget: target
      })
    }
  }

  doPromotion(which: string) {
    fetchJson(`/s/game/move/${this.gameId}/${this.state.promotionTempSource}/${this.state.promotionTempTarget}?promotion=${which}`,
      "POST", undefined, _ => {
        this.setState({ isPromoting: false });
      })
  }

  cancelPromotion() {
    this.setState({ isPromoting: false });
  }

  resignFirst() {
    this.setState({ showResignConfirm: true });
  }

  resignYes() {
    fetchJson(`/s/game/move/${this.gameId}/resign/resign`, "POST", undefined, _ => {
      this.setState({ showResignConfirm: false });
    });
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
    fetchJson(`/s/game/move/${this.gameId}/draw/yes`, "POST", undefined, _ => {
      this.setState({ showDrawConfirm: false, pendingDrawOffer: 1 });
    });
  }

  drawNo() {
    fetchJson(`/s/game/move/${this.gameId}/draw/no`, "POST", undefined, _ => {
      this.setState({ showDrawConfirm: false, pendingDrawOffer: 0 });
    });
  }

  secondsToString(total_seconds: number) {
    let hours_f = total_seconds / 3600;
    let hours = Math.floor(hours_f);
    let seconds_left = total_seconds % 3600;
    let minutes_f = seconds_left / 60;
    let minutes = Math.floor(minutes_f);
    let seconds = Math.floor(seconds_left % 60);
    if (total_seconds < 10) {
      let fraction = total_seconds - Math.floor(total_seconds);
      let tenths = Math.floor(fraction * 10);
      var tenthsStr = "." + tenths.toString();
    } else {
      var tenthsStr = "";
    }
    if (hours != 0) {
      return hours.toString() + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
    } else if (tenthsStr === "") {
      return "&nbsp;" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "&nbsp;";
    } else {
      return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + tenthsStr;
    }
  }

  clockTick() {
    if (this.state.clocksRunning) {
      const side = this.state.game.turn();
      const clockRef = (side === "w" ? this.whiteClockRef : this.blackClockRef).current!;
      clockRef.tick();
      const newTime = clockRef.state.current;
      if (newTime < 0 && this.state.isPlayer) {
        fetchJson(`/s/game/move/${this.gameId}/flag/flag`, "POST", undefined, _ => { });
      }
    }
  }

  render() {
    const splitMovePgn = this.state.pgn.trim().split(" ");
    let rows = [];
    if (this.state.pgn !== "") {
      for (let i = 0; i < splitMovePgn.length; i += 3) {
        rows.push(<tr key={i}>
          <td>{splitMovePgn[i]}</td>
          <td className={!splitMovePgn[i + 2] ? "highlight-blue" : undefined}>{splitMovePgn[i + 1]}</td>
          <td className={!splitMovePgn[i + 3] && splitMovePgn[i + 2] ? "highlight-blue" : undefined}>{splitMovePgn[i + 2]}</td>
        </tr>);
      }
    }

    return (
      <>
        <Helmet>
          <title>Play</title>
        </Helmet>

        <div className="mt-5"></div>

        {this.state.isPromoting &&
          <div className="d-flex flex-row justify-content-around">
            <div id="promotion-dialog">
              <img src="/images/pieces/wQ.svg" onClick={() => this.doPromotion("q")} />
              <img src="/images/pieces/wR.svg" onClick={() => this.doPromotion("r")} />
              <img src="/images/pieces/wB.svg" onClick={() => this.doPromotion("b")} />
              <img src="/images/pieces/wN.svg" onClick={() => this.doPromotion("n")} />
              <span onClick={this.cancelPromotion}>X</span>
            </div>
          </div>
        }

        <div className="d-flex flex-row justify-content-between">
          <div id="move-div">
            <table id="move-table" ref={this.moveTableRef}>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <Chessground
                fen={this.state.fen}
                orientation={this.state.orientation}
                turnColor={this.state.turn}
                onMove={this.onMove}
                ref={this.groundRef}
                style={this.state.isPromoting && { pointerEvents: "none", filter: "blur(3px)" }}
                movable={{ free: false, color: this.state.myColor, dests: this.state.dests, showDests: true }}
                premovable={{ enabled: false }}
                lastMove={this.state.lastMove}
                check={this.state.check} />
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between">
            {this.state.orientation === "black" ? <>
              <div><UserLink id={this.state.whiteId} name={this.state.whiteName} ghost={false} /></div>
              <div className={"clock" + (this.state.turn === "white" ? " running" : "")}>
                <Clock ref={this.whiteClockRef} />
              </div>
            </> : <>
                <div><UserLink id={this.state.blackId} name={this.state.blackName} ghost={false} /></div>
                <div className={"clock" + (this.state.turn === "black" ? " running" : "")}>
                  <Clock ref={this.blackClockRef} />
                </div>
              </>}

            {this.state.isPlayer && this.state.outcome === GameOutcome.Ongoing && <>
              <div className="btn-container">
                <a className="btn btn-primary" id="resign-btn" onClick={this.resignFirst}><Translated str="resign" /></a>
                {this.state.showResignConfirm &&
                  <div className="mt-4">
                    <a className="btn btn-danger" id="no-resign-btn" onClick={this.resignNo}><Translated str="no" /></a>
                    <a className="btn btn-success" id="yes-resign-btn" onClick={this.resignYes}><Translated str="yes" /></a>
                  </div>
                }
              </div>

              <div className="btn-container">
                <a className="btn btn-primary" id="draw-btn" onClick={this.drawFirst}>
                  {this.state.pendingDrawOffer === 2 ? <Translated str="acceptDraw" /> :
                    (this.state.pendingDrawOffer === 1 ? <Translated str="drawOfferPending" /> : <Translated str="offerDraw" />)}
                </a>
                {this.state.showDrawConfirm &&
                  <div className="mt-4">
                    <a className="btn btn-danger" id="no-draw-btn" onClick={this.drawNo}><Translated str="no" /></a>
                    <a className="btn btn-success" id="yes-draw-btn" onClick={this.drawYes}><Translated str="yes" /></a>
                  </div>
                }
              </div>
            </>}

            {this.state.orientation === "black" ? <>
              <div className={"clock" + (this.state.turn === "black" ? " running" : "")}>
                <Clock ref={this.blackClockRef} />
              </div>
              <div><UserLink id={this.state.blackId} name={this.state.blackName} ghost={false} /></div>
            </> : <>
                <div className={"clock" + (this.state.turn === "white" ? " running" : "")}>
                  <Clock ref={this.whiteClockRef} />
                </div>
                <div><UserLink id={this.state.whiteId} name={this.state.whiteName} ghost={false} /></div>
              </>}
          </div>
        </div>

        <div className="mt-5" id="game-result-div">
          {this.state.outcome !== GameOutcome.Ongoing && (
            this.state.outcome === GameOutcome.WhiteWins ? <Translated str="whiteWins" /> :
              (this.state.outcome === GameOutcome.BlackWins ? <Translated str="blackWins" /> : <Translated str="itsADraw" />)
          )}
        </div>

        <Websocket url={"wss://" + window.location.host + "/socket/" + this.gameId} onMessage={this.onWsMessage} />
      </>
    );
  }
}

export default Play;