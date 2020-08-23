import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Translated from "../../components/Translated";
import UserLink from "../../components/UserLink";
import { GameOutcome, numToSquare } from "./Play";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import './chessground-theme.css';
import { fetchJson } from "../../functions";
import Chess from 'chess.js';
import './View.css';

type ViewProps = {
  id: string
}

type ViewState = {
  myColor?: string
  whiteId: string
  blackId: string
  whiteName: string
  blackName: string
  outcome: GameOutcome
  fen: string
  lastMove?: string[]
  check: boolean
  pgn: string
  currentMove: number
  turn: string
}

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
      turn: "white"
    };

    this.gameId = props.match.params.id;
    this.allMoves = [];

    this.updateBoard = this.updateBoard.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-View";

    fetchJson(`/s/game/view/${this.gameId}`, "GET", undefined, result => {
      if (result.game.outcome === null) {
        this.props.history.push("/game/play/" + result.game.id);
        return;
      }

      this.allMoves = result.game.moves;
      this.setState({
        whiteId: result.game.white,
        blackId: result.game.black,
        whiteName: result.game.white_name,
        blackName: result.game.black_name,
        outcome: result.game.outcome === 1 ? GameOutcome.WhiteWins : (result.game.outcome === -1 ? GameOutcome.BlackWins : GameOutcome.Draw)
      }, () => {
        this.updateBoard(this.allMoves.length / 3 - 1, true);
      });
    });
  }

  updateBoard(moveNum: number, updatePgn: boolean) {
    const currentMove = Math.max(0, Math.min(this.allMoves.length / 3 - 1, moveNum));
    const moves = this.allMoves.slice(0, currentMove * 3 + 3);

    const game = new Chess();
    let lastMove = undefined;
    for (let i = 0; i < moves.length; i += 3) {
      const from = numToSquare(moves[i]);
      const to = numToSquare(moves[i + 1]);
      let prom: string | null = "-nbrq"[moves[i + 2]];
      if (prom === "-") {
        prom = null;
      }
      game.move({ "from": from, "to": to, "promotion": prom });
      lastMove = [from, to];
    }

    const fen = game.fen();
    const check = game.in_check();
    const turn = game.turn() === "w" ? "white" : "black";
    if (updatePgn) {
      this.setState({
        pgn: game.pgn(),
        fen,
        check,
        currentMove,
        turn,
        lastMove
      });
    } else {
      this.setState({
        fen,
        check,
        currentMove,
        turn,
        lastMove
      })
    }
  }

  componentDidUpdate() {
    document.querySelector(".highlight-blue")?.scrollIntoView(false);
    window.dispatchEvent(new Event("resize")); // apparently sometimes needed for chessground
  }

  render() {
    const splitMovePgn = this.state.pgn.trim().replace(/N/g, "♞").replace(/B/g, "♝").replace(/R/g, "♜").replace(/Q/g, "♛").replace(/K/g, "♚").split(" ");
    let rows = [];
    if (this.state.pgn !== "") {
      for (let i = 0; i < splitMovePgn.length; i += 3) {
        const j = i / 3;
        rows.push(<tr key={i}>
          <td>{splitMovePgn[i]}</td>
          <td className={"move" + (this.state.currentMove === 2 * j ? " highlight-blue" : "")} onClick={() => this.updateBoard(2 * j, false)}>
            {splitMovePgn[i + 1]}
          </td>
          <td className={"move" + (this.state.currentMove === 2 * j + 1 ? " highlight-blue" : "")} onClick={() => this.updateBoard(2 * j + 1, false)}>
            {splitMovePgn[i + 2]}
          </td>
        </tr>);
      }
    }

    return (<>
      <Helmet>
        <title>View</title>
      </Helmet>

      <div className="d-flex flex-row justify-content-between">
        <div id="move-div">
          <table id="move-table">
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <Chessground
              fen={this.state.fen}
              orientation={this.state.myColor || "white"}
              movable={{ free: false, color: undefined }}
              lastMove={this.state.lastMove}
              turnColor={this.state.turn}
              check={this.state.check}
              drawable={{ enabled: true }} />
          </div>
          <div className="d-flex flex-row mt-4" id="controls">
            <div id="controls-begin" className="flex-fill p-3" onClick={() => this.updateBoard(0, false)}>|&lt;&lt;</div>
            <div id="controls-prev" className="flex-fill p-3" onClick={() => this.updateBoard(this.state.currentMove - 1, false)}>|&lt;</div>
            <div id="controls-next" className="flex-fill p-3" onClick={() => this.updateBoard(this.state.currentMove + 1, false)}>&gt;|</div>
            <div id="controls-end" className="flex-fill p-3" onClick={() => this.updateBoard(this.allMoves.length / 3 - 1, false)}>&gt;&gt;|</div>
          </div>
        </div>

        <div className="d-flex flex-column justify-content-around" id="player-links">
          {this.state.myColor === "black" ? <>
            <div><UserLink id={this.state.whiteId} name={this.state.whiteName} ghost={false} /></div>
            <div><UserLink id={this.state.blackId} name={this.state.blackName} ghost={false} /></div>
          </> : <>
              <div><UserLink id={this.state.blackId} name={this.state.blackName} ghost={false} /></div>
              <div><UserLink id={this.state.whiteId} name={this.state.whiteName} ghost={false} /></div>
            </>}
        </div>
      </div>

      <div className="mt-4" id="game-result-div">
        {this.state.outcome !== GameOutcome.Ongoing && (
          this.state.outcome === GameOutcome.WhiteWins ? <Translated str="whiteWins" /> :
            (this.state.outcome === GameOutcome.BlackWins ? <Translated str="blackWins" /> : <Translated str="itsADraw" />)
        )}
      </div>

      <div className="mt-4">
        <p><Translated str="rawPgn" />:</p>
        <code id="raw-pgn">{this.state.pgn}</code>
      </div></>
    );
  }
}

export default View;