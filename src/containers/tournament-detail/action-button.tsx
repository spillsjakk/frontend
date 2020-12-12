import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import Translated from "../../components/translated";
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
    self_join_teams,
  } = useTournamentDetail();
  const {
    user: { authenticated, info },
  } = useUser();
  const params = useParams<{ tid: string }>();
  const history = useHistory();

  function onClickSelfLeave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

  function onClickSelfJoin(team: string) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      fetchJson(
        `/s/tournament/self-join/${params.tid}?team=${team}`,
        "POST",
        undefined,
        update!
      );
    };
  }

  function isOrganizer() {
    return authenticated && info?.id === tournament?.organizer;
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

  return (
    <>
      {authenticated && isOrganizer() && manageTournamentButton()}
      {authenticated &&
        tournament &&
        tournament.self_joinable &&
        Array.isArray(pairings) &&
        pairings.length === 0 && (
          <>
            {!is_participating ? (
              <>
                {self_join_teams &&
                  self_join_teams?.map((t, i) => (
                    <form onSubmit={onClickSelfJoin(t.id)} key={i}>
                      <div
                        key={t.id}
                        className={`${style["action-button"]} ${style["join-tournament"]}`}
                      >
                        <button type="submit">
                          <Translated str="joinFor" /> &quot;{t.name}&quot;
                        </button>
                      </div>
                    </form>
                  ))}
              </>
            ) : (
              <form onSubmit={onClickSelfLeave}>
                <div
                  className={`${style["action-button"]} ${style["leave-tournament"]}`}
                >
                  <button type="submit">
                    <Translated str="leave" />
                  </button>
                </div>
              </form>
            )}
          </>
        )}
    </>
  );
};

export { ActionButton };
