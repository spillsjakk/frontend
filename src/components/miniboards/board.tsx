/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
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
import { Chess, PawnVsPawn } from "@spillsjakk/chess.js";
import { Clock } from "./clock";
import style from "./style.module.scss";
import Translated from "../translated";
import UserLink from "../UserLink";
import { Link } from "react-router-dom";
import { DRAW_OFFER_SIGN, VARIANT } from "../../constants";

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
  white: string;
  black: string;
};

interface Props {
  game: Game;
  tournament: any;
}

const Board: FunctionComponent<Props> = (props) => {
  const { id, whiteName, blackName, finished, start, white, black } =
    props.game;

  const [ws, setWs] = useState<WebSocket>();
  const [fen, setFen] = useState("");
  const [turn, setTurn] = useState("white");
  const [groundRef] = useState<RefObject<typeof Chessground>>(createRef());
  const [whiteClockRef] = useState<RefObject<Clock>>(createRef());
  const [blackClockRef] = useState<RefObject<Clock>>(createRef());
  const [lastMove, setLastMove] = useState<Array<string>>();
  const [game, setGame] = useState<Chess>();
  const [outcome, setOutcome] = useState<number>();
  const [started, setStarted] = useState(() => {
    if (start) {
      const startDate = new Date(start);
      return new Date().getTime() - startDate.getTime() > 0;
    } else {
      return false;
    }
  });
  const [whiteInitialCountdown, setWhiteInitialCountdown] = useState(0);
  const [blackInitialCountdown, setBlackInitialCountdown] = useState(0);
  const [whiteClockTemp, setWhiteClockTemp] = useState(0);
  const [blackClockTemp, setBlackClockTemp] = useState(0);

  function reconstructGame(b64moves: string) {
    const game = (() => {
      switch (props.tournament?.game_variant) {
        case VARIANT[VARIANT.PawnVsPawn]: {
          return new PawnVsPawn();
        }
        default: {
          return new Chess();
        }
      }
    })();
    const bstr = atob(b64moves);
    let lastMove;
    for (let i = 0; i < bstr.length; i += 3) {
      if (bstr.charCodeAt(i) === 97) {
        // draw offer
        game.setComment(DRAW_OFFER_SIGN);
        continue;
      }
      const from = numToSquare(bstr.charCodeAt(i));
      const to = numToSquare(bstr.charCodeAt(i + 1));
      let prom: string | null = "-pnbrq"[bstr.charCodeAt(i + 2)];
      if (prom === "-") {
        prom = null;
      }
      try {
        game.move({ from: from, to: to, promotion: prom });
      } catch (e) {
        console.log(`error while moving`, e);
      }
      lastMove = [from, to];
    }

    return [game, lastMove];
  }

  function updateData(data: any) {
    if (data.t === "game") {
      const newState: any = {};

      const [game, lastMove] = reconstructGame(data.moves);
      setGame(game);
      newState.fen = game.fen();
      newState.turn = game.turn() === "w" ? "white" : "black";

      setLastMove(lastMove);

      const wc = data.wc - (data.wic > 0 ? 20 : 0);
      const bc = data.bc - (data.bic > 0 ? 20 : 0);

      setWhiteClockTemp(wc);
      setBlackClockTemp(bc);
      if (newState.turn === "white" && data.wic > 0) {
        setWhiteInitialCountdown(data.wic);
        if (blackClockRef) {
          whiteClockRef.current?.updateAndCache(data.wc - (20 - data.wic));
          blackClockRef.current?.updateAndCache(data.bc);
          whiteClockRef.current?.check();
        }
      } else if (newState.turn === "black" && data.bic > 0) {
        setWhiteInitialCountdown(0);
        setBlackInitialCountdown(data.bic);
        if (whiteClockRef && blackClockRef) {
          whiteClockRef.current?.updateAndCache(data.wc);
          blackClockRef.current?.updateAndCache(data.bc - (20 - data.bic));
          blackClockRef.current?.check();
        }
      } else if (whiteClockRef && blackClockRef) {
        if (blackInitialCountdown > 0) {
          setBlackInitialCountdown(0);
          if (blackClockRef && whiteClockRef) {
            whiteClockRef.current?.updateAndCache(wc);
            blackClockRef.current?.updateAndCache(bc);
            if (game.turn() === "w") {
              whiteClockRef.current?.check();
            } else {
              blackClockRef.current?.check();
            }
          }
        } else {
          whiteClockRef.current?.updateAndCache(wc);
          blackClockRef.current?.updateAndCache(bc);
          if (game.turn() === "w") {
            whiteClockRef.current?.check();
          } else {
            blackClockRef.current?.check();
          }
        }
      }

      if (data.finished) {
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
    const schema = window.location.host === "localhost" ? "ws://" : "wss://";
    const ws = new WebSocket(schema + window.location.host + "/socket/" + id);

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

  function clockTick() {
    if (!finished && whiteClockRef && blackClockRef) {
      const side = game.turn();
      const clockRef = (side === "w" ? whiteClockRef : blackClockRef).current;
      if (clockRef) {
        clockRef.tick();
      }
    }
  }

  useEffect(() => {
    if (game) {
      const clockInterval = setInterval(clockTick, 100);
      return () => {
        clearInterval(clockInterval);
      };
    }
  }, [game]);

  useEffect(() => {
    if (
      started &&
      whiteClockRef &&
      blackClockRef &&
      whiteClockTemp &&
      blackClockTemp
    ) {
      whiteClockRef.current?.updateAndCache(whiteClockTemp);
      blackClockRef.current?.updateAndCache(blackClockTemp + 20);
    }
  }, [started]);

  useEffect(() => {
    const checkStartedInterval = setInterval(() => {
      if (!started && start) {
        const startDate = new Date(start);
        if (new Date().getTime() - startDate.getTime() > 0) {
          setStarted(true);
        }
      }
    }, 1000);

    return () => {
      clearInterval(checkStartedInterval);
    };
  }, []);

  useEffect(() => {
    if (!finished) {
      connect();

      return () => {
        if (ws) {
          ws.close();
        }
      };
    } else {
      let outcome;
      if (props.game.outcome === -1) {
        outcome = GameOutcome.BlackWins;
      } else if (props.game.outcome === 0) {
        outcome = GameOutcome.Draw;
      } else if (props.game.outcome === 1) {
        outcome = GameOutcome.WhiteWins;
      } else {
        outcome = props.game.outcome;
      }
      setOutcome(outcome);
    }
  }, []);

  function getWhoWon() {
    if (outcome === GameOutcome.WhiteWins) {
      return Translated.byKey("whiteWon");
    } else if (outcome === GameOutcome.BlackWins) {
      return Translated.byKey("blackWon");
    } else if (outcome === GameOutcome.Draw) {
      return Translated.byKey("draw");
    } else {
      return Translated.byKey("finished");
    }
  }

  return (
    <div id={style.board}>
      {outcome && <div className={style.outcome}>{getWhoWon()}</div>}
      <div className={style.info}>
        <div className={style.name}>
          <UserLink id={black} name={blackName} ghost={false} />
        </div>
        <div className="clock">
          {blackClockRef && started && !outcome && (
            <Clock ref={blackClockRef} />
          )}
        </div>
      </div>
      <Link to={`/game/play/${id}`} target="_blank" className={style.board}>
        <Chessground
          fen={fen}
          orientation={"white"}
          turnColor={turn}
          ref={groundRef}
          lastMove={lastMove}
          style={{
            pointerEvents: "none",
            width: "250px",
            height: "250px",
            opacity: typeof outcome !== "undefined" ? 0.4 : 1,
          }}
        />
      </Link>
      <div className={`${style.info} mt-2`}>
        <div className={style.name}>
          <UserLink id={white} name={whiteName} ghost={false} />
        </div>
        <div className="clock">
          {whiteClockRef && started && !outcome && (
            <Clock ref={whiteClockRef} />
          )}
        </div>
      </div>
    </div>
  );
};

export { Board };
