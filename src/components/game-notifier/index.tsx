import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../translated";
import { Link, useLocation } from "react-router-dom";
import { fetchJson } from "../../functions";
import { useUser } from "../UserContext";
import { GameNotifierPopup } from "./popup";
import style from "./style.module.scss";
import { Clear } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const GameNotifier: FunctionComponent<unknown> = () => {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showGameNotifierPopup, setShowGameNotifierPopup] = useState(false);

  const { user } = useUser();
  const location = useLocation();

  function checkForGame() {
    if (!user.authenticated) {
      return;
    }

    fetchJson(`/s/game/lobby`, "GET", undefined, (result) => {
      if (result.authenticated === false) {
        return;
      }

      if (result.next !== -1 && result.next <= 600000) {
        setShouldPlay(
          !(
            location.pathname === "/calendar" ||
            location.pathname === "/game/play/" + result.id
          )
        );
        const gameIdFromLocalStorage = localStorage.getItem(
          "gameNotifierPopupIsShownFor"
        );
        if (result.id && gameIdFromLocalStorage !== result.id) {
          setShowGameNotifierPopup(true);
          localStorage.setItem("gameNotifierPopupIsShownFor", result.id);
        }
      } else {
        setShouldPlay(false);
      }
    });
  }

  useEffect(() => {
    checkForGame();
    const interval = setInterval(checkForGame, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [user, location.pathname]);

  return (
    <>
      {shouldPlay && (
        <div
          id="game-notifier-alert"
          className={`${style["game-notifier-alert"]} ${
            location.pathname.startsWith("/game/play")
              ? style["small-view-top-right"]
              : ""
          }`}
          role="alert"
        >
          <strong>
            <Translated str="aboutToPlay" />{" "}
            <Link to="/calendar">
              <Translated str="goToLobby" />
            </Link>
          </strong>
          <IconButton
            onClick={() => setShouldPlay(false)}
            className={style.close}
          >
            <Clear />
          </IconButton>
          <GameNotifierPopup
            show={showGameNotifierPopup}
            onClose={() => setShowGameNotifierPopup(false)}
          />
        </div>
      )}
    </>
  );
};

export { GameNotifier };
