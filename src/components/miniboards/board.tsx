/* eslint-disable no-unused-expressions */
import React, {
  FunctionComponent,
  useEffect,
  useState,
  RefObject,
  createRef,
} from "react";
import "react-chessground/dist/styles/chessground.css";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Chess as OpsChess } from "chessops";
import { parseFen } from "chessops/fen";
import { chessgroundDests } from "chessops/compat";
import { Clock } from "./clock";
import style from "./style.module.scss";

export function numToSquare(num: number) {
  const file = "abcdefgh"[num % 8];
  const rank = Math.floor(num / 8) + 1;
  return file + rank.toString();
}

export enum GameOutcome {
  Ongoing,
  WhiteWins,
  Draw,
  BlackWins,
}

type Game = {
  id: string;
  whiteName: string;
  blackName: string;
  start: string;
  outcome: number | null;
  round: number;
  finished: boolean;
};

interface Props {
  game: Game;
}

const Board: FunctionComponent<Props> = ({
  game: { id, whiteName, blackName },
}) => {
  const [ws, setWs] = useState<WebSocket>();
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [turn, setTurn] = useState("white");
  const [groundRef, setGroundRef] = useState<RefObject<typeof Chessground>>();
  const [whiteClockRef, setWhiteClockRef] = useState<RefObject<Clock>>();
  const [blackClockRef, setBlackClockRef] = useState<RefObject<Clock>>();
  const [lastMove, setLastMove] = useState<Array<string>>();
  const [game, setGame] = useState<typeof Chess>();
  const [pgn, setPgn] = useState<string>();
  const [dests, setDests] = useState<any>();
  const [outcome, setOutcome] = useState<number>();
  const [clocksRunning, setClocksRunning] = useState<boolean>();
  const [whiteCountdownTemp, setWhiteCountdownTemp] = useState<number>();
  const [blackCountdownTemp, setBlackCountdownTemp] = useState<number>();
  const [whiteInitialCountdown, setWhiteInitialCountdown] = useState<number>();
  const [blackInitialCountdown, setBlackInitialCountdown] = useState<number>();

  function reconstructGame(b64moves: string) {
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

  function updateData(data: any) {
    if (data.t === "game") {
      const newState: any = {};

      const [game, lastMove] = reconstructGame(data.moves);
      setGame(game);
      setPgn(
        game
          .pgn()
          .replace(/N/g, "♞")
          .replace(/B/g, "♝")
          .replace(/R/g, "♜")
          .replace(/Q/g, "♛")
          .replace(/K/g, "♚")
      );
      newState.fen = game.fen();

      setClocksRunning(!data.finished);
      setLastMove(lastMove);
      newState.turn = game.turn() === "w" ? "white" : "black";

      const opsGame = OpsChess.fromSetup(
        parseFen(newState.fen).unwrap()
      ).unwrap();

      const wc = data.wc - (data.wic > 0 ? 20 : 0);
      const bc = data.bc - (data.bic > 0 ? 20 : 0);

      setWhiteCountdownTemp(wc);
      setBlackCountdownTemp(bc);
      if (newState.turn === "white" && data.wic > 0) {
        setWhiteInitialCountdown(data.wic);
        if (blackClockRef) {
          blackClockRef.current?.updateAndCache(bc);
        }
      } else if (newState.turn === "black" && data.bic > 0) {
        setBlackInitialCountdown(data.bic);
        setTurn(newState.turn);
        if (whiteClockRef) {
          whiteClockRef.current?.updateAndCache(wc);
          whiteClockRef.current?.check();
        }
      } else if (whiteClockRef && blackClockRef) {
        whiteClockRef.current?.updateAndCache(wc);
        blackClockRef.current?.updateAndCache(bc);
        if (game.turn() === "w") {
          whiteClockRef.current?.check();
        } else {
          blackClockRef.current?.check();
        }
      }

      if (!data.finished) {
        setDests(chessgroundDests(opsGame));
      } else {
        if (data.result === 1) {
          setOutcome(GameOutcome.WhiteWins);
        } else if (data.result === -1) {
          setOutcome(GameOutcome.BlackWins);
        } else {
          setOutcome(GameOutcome.Draw);
        }
      }

      setFen(newState.fen);
      setTurn(newState.turn);
    }
  }

  function connect() {
    const ws = new WebSocket("wss://" + window.location.host + "/socket/" + id);

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket");
      setWs(ws);
    };

    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      updateData(JSON.parse(evt.data));
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
  }

  useEffect(() => {
    setGroundRef(createRef());
    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div id={style.board}>
      <div className={style.info}>
        <div className={style.name}>{blackName}</div>
        <div className="clock">
          <Clock ref={blackClockRef} />
        </div>
      </div>
      <div className={style.board}>
        <Chessground
          fen={fen}
          orientation={"white"}
          turnColor={turn}
          ref={groundRef}
          lastMove={lastMove}
          style={{
            pointerEvents: "none",
            width: "200px",
            height: "200px",
          }}
        />
      </div>
      <div className={`${style.info} mt-2`}>
        <div className={style.name}>{whiteName}</div>
        <div className="clock">
          <Clock ref={whiteClockRef} />
        </div>
      </div>
    </div>
  );
};

export { Board };
