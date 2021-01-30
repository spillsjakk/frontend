import React, { FunctionComponent, useEffect, useState } from "react";
import { TournamentSchedule } from "../../containers/lobby/tournament-schedule";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import "./style.scss";
import { useUser } from "../../components/UserContext";
import Translated from "../../components/translated";
import { CircularCountDown } from "../../components/circular-count-down";
import UserLink from "../../components/UserLink";

const Lobby: FunctionComponent<{}> = () => {
  const [redirectAt, setRedirectAt] = useState<Date | undefined>();
  const [gameId, setGameId] = useState();
  const [info, setInfo] = useState<any>();

  const history = useHistory();

  const { user } = useUser();

  function tick() {
    if (redirectAt && gameId && new Date().getTime() > redirectAt.getTime()) {
      history.replace(`/game/play/${gameId}`);
    }
  }

  function load() {
    fetchJson(`/s/game/lobby`, "GET", undefined, (json) => {
      if (json.authenticated === false) {
        history.replace("/login?path=/calendar");
        return;
      }

      if (json.next === -1) {
        setRedirectAt(undefined);
        setGameId(undefined);
        setInfo(undefined);

        return;
      }

      if (json.next === 0) {
        history.replace("/game/play/" + json.id);
        return;
      }

      const localRedirectAt = new Date();
      console.log("a", localRedirectAt);
      localRedirectAt.setTime(localRedirectAt.getTime() + json.next + 200);
      setRedirectAt(localRedirectAt);
      setGameId(json.id);
      setInfo(json.info);
    });
  }

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "lobby-page";
    load();
    const loadInterval = window.setInterval(load, 45000);

    return function () {
      window.clearInterval(loadInterval);
    };
  }, []);

  useEffect(() => {
    if (redirectAt && gameId) {
      const tickInterval = window.setInterval(tick, 250);

      return function () {
        window.clearInterval(tickInterval);
      };
    }
  }, [redirectAt, gameId]);

  function getUserLink() {
    return (
      <UserLink id={user.info?.id!} name={user.info?.name!} ghost={false} />
    );
  }

  function getOpponentLink() {
    return <UserLink id={info?.opp_id} name={info?.opp_name} ghost={false} />;
  }

  function getOrientation(orientation: "black" | "white") {
    if (info?.orientation === orientation) {
      return getUserLink();
    } else {
      return getOpponentLink();
    }
  }

  return (
    <>
      <Helmet>
        <title>{title("lobby")}</title>
      </Helmet>
      {redirectAt instanceof Date && (
        <>
          <div className="header">
            {Translated.byKey("nextGameIsIn").toUpperCase()}:
          </div>

          <div className="box">
            <CircularCountDown startDate={redirectAt} />

            <div className="d-flex justify-content-between">
              <div>
                <a href={`/tournament/view/${info?.tournament}`}>
                  <Translated str="goToTournamentDetail" />
                </a>
              </div>
              <div>
                {getOrientation("white")}
                &nbsp; v &nbsp;
                {getOrientation("black")}
                &nbsp;
                {Translated.byKey("round")}: {info?.round}
              </div>
            </div>
          </div>
        </>
      )}
      <TournamentSchedule userId={user.info?.id} />
    </>
  );
};

export { Lobby };
