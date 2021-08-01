import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GameOutcome } from "./play";
import { numToSquare } from "./play/clock";
import { Link, RouteComponentProps } from "react-router-dom";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import "./chessground-theme.css";
import { fetchJson, title } from "../../functions";
import Chess from "chess.js";
import "./View.css";
import { UserInfoBox } from "./play/user-info-box";
import { Tournament } from "../Tournament/Types";
import { DRAW_OFFER_SIGN } from "../../constants";
import { FileCopy } from "@material-ui/icons";

type ViewProps = {
  id: string;
};

type ViewState = {
  myColor?: string;
  whiteId: string;
  blackId: string;
  whiteName: string;
  blackName: string;
  outcome: GameOutcome;
  fen: string;
  lastMove?: string[];
  check: boolean;
  pgn: string;
  currentMove: number;
  turn: string;
  white_fide_federation: string;
  black_fide_federation: string;
  orientation: string;
  round?: number;
  startDate?: string;
  tournamentData?: Tournament;
  pgnCopied: boolean;
};

class View extends Component<RouteComponentProps<ViewProps>, ViewState> {
  gameId: string;
  allMoves: number[];

  constructor(props: RouteComponentProps<ViewProps>) {
    super(props);

    this.state = {
      whiteId: "",
      blackId: "",
      whiteName: "",
      blackName: "",
      outcome: GameOutcome.Ongoing,
      fen: "8/8/8/8/8/8/8/8 w KQkq - 0 1",
      check: false,
      pgn: "",
      currentMove: 0,
      turn: "white",
      white_fide_federation: "",
      black_fide_federation: "",
      orientation: "",
      pgnCopied: false,
    };

    this.gameId = props.match.params.id;
    this.allMoves = [];

    this.updateBoard = this.updateBoard.bind(this);
    this.getOpponentInfo = this.getOpponentInfo.bind(this);
    this.getSelfInfo = this.getSelfInfo.bind(this);
    this.renderOpponentBox = this.renderOpponentBox.bind(this);
    this.renderSelfBox = this.renderSelfBox.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-View";

    fetchJson(`/s/game/view/${this.gameId}`, "GET", undefined, (result) => {
      if (result.game.outcome === null) {
        this.props.history.push("/game/play/" + result.game.id);
        return;
      }

      fetchJson(
        `/s/game/${this.gameId}/accounts/info?white=${result.game.white}&black=${result.game.black}`,
        "GET",
        undefined,
        (json) => {
          if (json) {
            this.setState({
              white_fide_federation: json.white_fide_federation,
              black_fide_federation: json.black_fide_federation,
            });
          }
        }
      );

      this.allMoves = result.game.moves;
      this.setState(
        {
          whiteId: result.game.white,
          blackId: result.game.black,
          whiteName: result.game.white_name,
          blackName: result.game.black_name,
          startDate: result.game.start,
          round: result.game.round,
          tournamentData: result.tournament,
          outcome:
            result.game.outcome === 1
              ? GameOutcome.WhiteWins
              : result.game.outcome === -1
              ? GameOutcome.BlackWins
              : GameOutcome.Draw,
        },
        () => {
          const currentMove = Math.max(
            0,
            Math.min(this.allMoves.length / 3 - 1, this.allMoves.length / 3 - 1)
          );
          const moves = this.allMoves.slice(0, currentMove * 3 + 3);
          const [lastMove, game] = this.reconstructGame(moves);
          const fen = game.fen();
          const check = game.in_check();
          const turn = game.turn() === "w" ? "white" : "black";
          this.setState({
            pgn: game.pgn(),
            currentMove: this.allMoves.filter((m) => m !== 97).length / 3 - 1,
            fen,
            check,
            turn,
            lastMove,
          });
        }
      );
    });
  }

  reconstructGame(moves: Array<number>) {
    const game = new Chess();
    let lastMove;
    for (let i = 0; i < moves.length; i += 3) {
      if (moves[i] === 97) {
        // draw offer
        game.set_comment(DRAW_OFFER_SIGN);
        continue;
      }
      const from = numToSquare(moves[i]);
      const to = numToSquare(moves[i + 1]);
      let prom: string | null = "-nbrq"[moves[i + 2]];
      if (prom === "-") {
        prom = null;
      }
      game.move({ from: from, to: to, promotion: prom });
      lastMove = [from, to];
    }

    return [lastMove, game];
  }

  updateBoard(moveNum: number) {
    const allMovesWithoutDrawOffers = this.allMoves.filter((m) => m !== 97);
    const currentMove = Math.max(
      0,
      Math.min(allMovesWithoutDrawOffers.length / 3 - 1, moveNum)
    );
    const moves = allMovesWithoutDrawOffers.slice(0, currentMove * 3 + 3);
    const [lastMove, game] = this.reconstructGame(moves);

    const fen = game.fen();
    const check = game.in_check();
    const turn = game.turn() === "w" ? "white" : "black";
    this.setState({
      fen,
      check,
      currentMove,
      turn,
      lastMove,
    });

    // eslint-disable-next-line no-unused-expressions
    document.querySelector(".highlight-blue")?.scrollIntoView(false);
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

  getPgn() {
    return `
      [Event "${this.state.tournamentData?.name}"]
      [Site "spillsjakk.no"]
      [Date "${this.state.startDate}"]
      [round "${this.state.round}"]
      [White "${this.state.whiteName}"]
      [Black "${this.state.blackName}"]
      [Result "${
        this.state.outcome !== GameOutcome.Ongoing &&
        (this.state.outcome === GameOutcome.WhiteWins
          ? "1-0"
          : this.state.outcome === GameOutcome.BlackWins
          ? "0-1"
          : "1/2-1/2")
      }"]
      ${this.state.pgn}
    `;
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

  componentDidUpdate() {
    window.dispatchEvent(new Event("resize")); // apparently sometimes needed for chessground
  }

  render() {
    const splitMovePgn = this.state.pgn
      .trim()
      .replace(/N/g, "♞")
      .replace(/B/g, "♝")
      .replace(/R/g, "♜")
      .replace(/Q/g, "♛")
      .replace(/K/g, "♚")
      .split(" ");
    const rows = [];
    if (this.state.pgn !== "") {
      // for loop removes the draw offers
      for (let i = 0; i < splitMovePgn.length; i++) {
        if (splitMovePgn[i] === `{${DRAW_OFFER_SIGN}}`) {
          splitMovePgn.splice(i, 1);
        }
      }
      for (let i = 0; i < splitMovePgn.length; i += 3) {
        const j = i / 3;
        rows.push(
          <tr key={i}>
            <td>{splitMovePgn[i]}</td>
            <td
              className={
                "move" +
                (this.state.currentMove === 2 * j ? " highlight-blue" : "")
              }
              onClick={() => this.updateBoard(2 * j)}
            >
              {splitMovePgn[i + 1]}
            </td>
            <td
              className={
                "move" +
                (this.state.currentMove === 2 * j + 1 ? " highlight-blue" : "")
              }
              onClick={() => this.updateBoard(2 * j + 1)}
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
          <title>{title("viewGame")}</title>
        </Helmet>

        <div className="d-flex flex-row mt-4 box">
          <div id="move-div">
            <div className="tournament-link">
              <Link to={`/tournament/view/${this.state.tournamentData?.id}`}>
                {Translated.byKey("backToTournament")}
              </Link>
            </div>
            <table id="move-table">
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
                orientation={this.state.myColor || "white"}
                movable={{ free: false, color: undefined }}
                lastMove={this.state.lastMove}
                turnColor={this.state.turn}
                check={this.state.check}
                drawable={{ enabled: true }}
              />
            </div>
            <div className="d-flex flex-row user-box">
              {this.renderSelfBox()}
            </div>
            <div className="d-flex flex-row" id="controls">
              <div
                id="controls-begin"
                className="flex-fill p-3"
                onClick={() => this.updateBoard(0)}
              >
                |&lt;&lt;
              </div>
              <div
                id="controls-prev"
                className="flex-fill p-3"
                onClick={() => this.updateBoard(this.state.currentMove - 1)}
              >
                |&lt;
              </div>
              <div
                id="controls-next"
                className="flex-fill p-3"
                onClick={() => this.updateBoard(this.state.currentMove + 1)}
              >
                &gt;|
              </div>
              <div
                id="controls-end"
                className="flex-fill p-3"
                onClick={() => this.updateBoard(this.allMoves.length / 3 - 1)}
              >
                &gt;&gt;|
              </div>
            </div>
          </div>

          <div
            className="d-flex flex-column justify-content-around"
            id="player-links"
          ></div>
        </div>

        <div className="mt-4" id="game-result-div">
          {this.state.outcome !== GameOutcome.Ongoing &&
            (this.state.outcome === GameOutcome.WhiteWins ? (
              <Translated str="whiteWins" />
            ) : this.state.outcome === GameOutcome.BlackWins ? (
              <Translated str="blackWins" />
            ) : (
              <Translated str="itsADraw" />
            ))}
        </div>

        <div className="mt-4">
          <p>
            <Translated str="rawPgn" />:
          </p>
          <code id="raw-pgn">{this.getPgn()}</code>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top-copy`}>
                {!this.state.pgnCopied && (
                  <strong>{Translated.byKey("clickToCopy")}</strong>
                )}
                {this.state.pgnCopied && (
                  <strong>{Translated.byKey("copied")}</strong>
                )}
              </Tooltip>
            }
          >
            <span
              className="pointer"
              onClick={() => {
                navigator.clipboard.writeText(this.getPgn());
                this.setState({ pgnCopied: true });
              }}
            >
              <FileCopy />
            </span>
          </OverlayTrigger>
        </div>
      </>
    );
  }
}

export default View;
