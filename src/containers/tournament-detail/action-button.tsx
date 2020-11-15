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
    self_join_teams,
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

  function onClickSelfJoin(team: string) {
    fetchJson(
      `/s/tournament/self-join/${params.tid}?team=${team}`,
      "POST",
      undefined,
      update!
    );
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
              <form>
                {self_join_teams &&
                  self_join_teams?.map((t) => (
                    <div
                      key={t.id}
                      className={`${style["action-button"]} ${style["join-tournament"]}`}
                    >
                      <button onClick={() => onClickSelfJoin(t.id)}>
                        <Translated str="joinFor" /> &quot;{t.name}&quot;
                      </button>
                    </div>
                  ))}
              </form>
            ) : (
              <form>
                <div
                  className={`${style["action-button"]} ${style["leave-tournament"]}`}
                >
                  <button onClick={onClickSelfLeave}>
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
