import React, { FunctionComponent, useEffect, useState } from "react";
import { useTournamentDetail } from "../../../context/tournament-detail";
import Translated from "../../../components/translated";
import { useUser } from "../../../components/UserContext";
import style from "./style.module.scss";
import { fetchJson } from "../../../functions";
import { useParams, useHistory } from "react-router-dom";
import { HelpBox, helpboxNames } from "../../../components/help-box";

function intersect(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}

const ActionButton: FunctionComponent<{}> = () => {
  const [managedTeams, setManagedTeams] = useState([]);
  const [managedAndParticipatingTeams, setManagedAndParticipatingTeams] =
    useState([]);
  const {
    tournament,
    teams,
    is_participating,
    update,
    self_join_teams,
    can_manage,
  } = useTournamentDetail();
  const {
    user: { authenticated },
  } = useUser();
  const params = useParams<{ tid: string }>();
  const history = useHistory();

  function onClickSelfLeave(e: any) {
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
    return (e: any) => {
      e.preventDefault();
      fetchJson(
        `/s/tournament/self-join/${params.tid}?team=${team}`,
        "POST",
        undefined,
        update!
      );
    };
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

  function getManagedTeams() {
    fetchJson(`/s/account/managed-teams`, "GET", undefined, (response) => {
      if (Array.isArray(response)) {
        setManagedTeams(response);
      }
    });
  }

  useEffect(() => {
    getManagedTeams();
  }, []);

  useEffect(() => {
    if (
      Array.isArray(teams) &&
      teams.length > 0 &&
      Array.isArray(managedTeams) &&
      managedTeams.length > 0
    ) {
      setManagedAndParticipatingTeams(
        intersect(
          teams.map((t) => t.team_id),
          managedTeams
        )
      );
    }
  }, [teams, managedTeams]);

  return (
    <>
      {authenticated && can_manage && (
        <HelpBox
          placement="bottom"
          name={helpboxNames.tournamentDetailManageTournament}
          text={Translated.byKey("tournamentDetailManageTournamentHelpbox")}
          show={true}
        >
          {manageTournamentButton()}
        </HelpBox>
      )}
      {authenticated && tournament && tournament.self_joinable && (
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
      {authenticated &&
        Array.isArray(managedAndParticipatingTeams) &&
        managedAndParticipatingTeams.map((team, i) => (
          <a
            key={i}
            className={`${style["action-button"]} ${style["manage-tournament"]}`}
            href={`/tournament/manage-team/${tournament.id}/${team}`}
          >
            <button>
              {Translated.byKey("manageTeam")}&nbsp;
              {(teams.find((t) => t.team_id === team) as any).name}
            </button>
          </a>
        ))}
    </>
  );
};

export { ActionButton };
