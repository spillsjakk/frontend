import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import Translated from "../../components/Translated";
import { useUser } from "../../components/UserContext";
import style from "./style.module.scss";

const ActionButton: FunctionComponent<{}> = () => {
  const { tournament, pairings, is_participating } = useTournamentDetail();
  const {
    user: { authenticated, info },
  } = useUser();

  function isOrganizer() {
    return authenticated && info?.id === tournament?.organizer;
  }

  function joinTournamentButton() {
    return (
      <div className={`${style["action-button"]} ${style["join-tournament"]}`}>
        <button>{Translated.byKey("joinTournament")}</button>
      </div>
    );
  }

  function manageTournamentButton() {
    return (
      <div
        className={`${style["action-button"]} ${style["manage-tournament"]}`}
      >
        <button>{Translated.byKey("manageTournament")}</button>
      </div>
    );
  }

  function leaveTournamentButton() {
    return (
      <div className={`${style["action-button"]} ${style["leave-tournament"]}`}>
        <button>{Translated.byKey("leaveTournament")}</button>
      </div>
    );
  }

  function render() {
    if (authenticated && isOrganizer) {
      return manageTournamentButton();
    }

    if (authenticated && is_participating) {
      return leaveTournamentButton();
    }

    if (authenticated && tournament?.self_joinable && pairings?.length === 0) {
      return joinTournamentButton();
    }

    return <></>;
  }

  return <>{render()}</>;
};

export { ActionButton };
