import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { GameOutcome } from "./play";
import { numToSquare } from "./play/clock";
import { Link, RouteComponentProps } from "react-router-dom";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import "./chessground-theme.css";
import { fetchJson, title } from "../../functions";
import { Chess, PawnVsPawn } from "@spillsjakk/chess.js";
import "./View.css";
import { UserInfoBox } from "./play/user-info-box";
import { Tournament } from "../Tournament/Types";
import { DRAW_OFFER_SIGN, VARIANT } from "../../constants";
import { FileCopy } from "@material-ui/icons";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import { Button, Grid } from "@material-ui/core";

type ViewProps = {
  id: string;
};

type ViewState = {
  myColor?: string;
  whiteId: string;
  blackId: string;
  whiteName: string;
  whiteUserName: string;
  blackName: string;
  blackUserName: string;
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
  illegalMove: {
    showPopup: boolean;
    message: string;
  };
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
      whiteUserName: "",
      blackName: "",
      blackUserName: "",
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
      illegalMove: {
        showPopup: false,
        message: "",
      },
    };

    this.gameId = props.match.params.id;
    this.allMoves = [];

    this.updateBoard = this.updateBoard.bind(this);
    this.getOpponentInfo = this.getOpponentInfo.bind(this);
    this.getSelfInfo = this.getSelfInfo.bind(this);
    this.renderOpponentBox = this.renderOpponentBox.bind(this);
    this.renderSelfBox = this.renderSelfBox.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(e) {
    if (e.keyCode === 39) {
      this.updateBoard(this.state.currentMove + 1);
    }

    if (e.keyCode === 37) {
      this.updateBoard(this.state.currentMove - 1);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-View";

    document.addEventListener("keydown", this.onKeyPress);

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
          whiteUserName: result.game.white_username,
          blackName: result.game.black_name,
          blackUserName: result.game.black_username,
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
          const check = game.inCheck();
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

  reconstructGame(moves: Array<number>): [[string, string], Chess] {
    const game = (() => {
      switch (this.state.tournamentData?.game_variant) {
        case VARIANT[VARIANT.PawnVsPawn]: {
          return new PawnVsPawn();
        }
        default: {
          return new Chess();
        }
      }
    })();
    let lastMove;
    for (let i = 0; i < moves.length; i += 3) {
      if (moves[i] === 97) {
        // draw offer
        game.setComment(DRAW_OFFER_SIGN);
        continue;
      }
      const from = numToSquare(moves[i]);
      const to = numToSquare(moves[i + 1]);
      let prom: string | null = "-pnbrq"[moves[i + 2]];
      if (prom === "-") {
        prom = null;
      }
      try {
        game.move({ from: from, to: to, promotion: prom });
      } catch (e) {
        console.log(`error while moving`, e);
        this.setState({
          illegalMove: {
            showPopup: true,
            message: `The player illegally moved from ${from} to ${to}`,
          },
        });
      }
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
    const check = game.inCheck();
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
        name: this.state.tournamentData?.show_only_usernames
          ? this.state.whiteUserName
          : this.state.whiteName,
      }
      : {
        id: this.state.blackId,
        name: this.state.tournamentData?.show_only_usernames
          ? this.state.blackUserName
          : this.state.blackName,
      };
  }

  getSelfInfo() {
    return this.state.orientation !== "black"
      ? {
        id: this.state.whiteId,
        name: this.state.tournamentData?.show_only_usernames
          ? this.state.whiteUserName
          : this.state.whiteName,
      }
      : {
        id: this.state.blackId,
        name: this.state.tournamentData?.show_only_usernames
          ? this.state.blackUserName
          : this.state.blackName,
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
      [Result "${this.state.outcome !== GameOutcome.Ongoing &&
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

        <div className="box">
          <Grid container>
            <Grid item container sm={12} md={9} justifyContent="center">
              <div className="play-box">
                <div className="user-box">{this.renderOpponentBox()}</div>
                <div id="board">
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
                <div className="user-box">{this.renderSelfBox()}</div>
                <div id="controls">
                  <div id="controls-begin" onClick={() => this.updateBoard(0)}>
                    <Button variant="outlined">
                      <FirstPageIcon />
                    </Button>
                  </div>
                  <div
                    id="controls-prev"
                    onClick={() => this.updateBoard(this.state.currentMove - 1)}
                  >
                    <Button variant="outlined">
                      <KeyboardArrowLeftIcon />
                    </Button>
                  </div>
                  <div
                    id="controls-next"
                    onClick={() => this.updateBoard(this.state.currentMove + 1)}
                  >
                    <Button variant="outlined">
                      <KeyboardArrowRightIcon />
                    </Button>
                  </div>
                  <div
                    id="controls-end"
                    onClick={() =>
                      this.updateBoard(this.allMoves.length / 3 - 1)
                    }
                  >
                    <Button variant="outlined">
                      <LastPageIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item container sm={12} md={3} justifyContent="center">
              <div id="move-div">
                <div className="tournament-link">
                  <Link
                    to={`/tournament/view/${this.state.tournamentData?.id}`}
                  >
                    {Translated.byKey("backToTournament")}
                  </Link>
                </div>
                <table id="move-table">
                  <tbody>{rows}</tbody>
                </table>
              </div>
            </Grid>
          </Grid>
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
        <Modal
          id="outcome-popup"
          show={this.state.illegalMove.showPopup}
          onHide={() =>
            this.setState({ illegalMove: { showPopup: false, message: "" } })
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>Illegal Move</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.illegalMove.message}</Modal.Body>
        </Modal>
      </>
    );
  }
}

export default View;
