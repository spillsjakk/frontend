import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import Translated from "../../components/Translated";
import { useUser } from "../../components/UserContext";
import style from "./style.module.scss";
import { fetchJson } from "../../functions";
import { useParams, useHistory } from "react-router-dom";

const ActionButton: FunctionComponent<{}> = () => {
  const {
    tournament,
    pairings,
    is_participating,
    update,
  } = useTournamentDetail();
  const {
    user: { authenticated, info },
  } = useUser();
  const params = useParams<{ tid: string }>();
  const history = useHistory();

  function onClickSelfLeave() {
    fetchJson(
      `/s/tournament/self-leave/${params.tid}`,
      "POST",
      undefined,
      update!
    );
  }

  function onClickManage() {
    history.push(`/tournament/manage/${params.tid}`);
  }

  // TODO: implement selecting team
  // function onClickSelfJoin(team: string) {
  //   fetchJson(
  //     `/s/tournament/self-join/${params.tid}?team=${team}`,
  //     "POST",
  //     undefined,
  //     update!
  //   );
  // }

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
        <button onClick={onClickManage}>
          {Translated.byKey("manageTournament")}
        </button>
      </div>
    );
  }

  function leaveTournamentButton() {
    return (
      <div className={`${style["action-button"]} ${style["leave-tournament"]}`}>
        <button onClick={onClickSelfLeave}>
          {Translated.byKey("leaveTournament")}
        </button>
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
