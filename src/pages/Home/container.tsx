import React, { FunctionComponent, useEffect, useState } from "react";
import { HelpBox, helpboxNames } from "../../components/help-box";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { fetchCall } from "../../functions";
import { League as ILeague } from "../../hocs/with-league";
import { Tournament } from "../../pages/Tournament/Types";
import { League } from "./league";
import { Card } from "../../components/tournament-card/card";
import style from "./style.module.scss";

function dateDiffInDays(dt1, dt2) {
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
}

const Home: FunctionComponent<{}> = () => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  const [today, setToday] = useState<Array<Tournament>>([]);
  const [soon, setSoon] = useState<Array<Tournament>>([]);
  const [later, setLater] = useState<Array<Tournament>>([]);
  const [leagues, setLeagues] = useState<Array<ILeague>>([]);

  const { user } = useUser();

  function fetchTournaments() {
    fetchCall(
      "/s/tournament/find",
      "GET",
      undefined,
      (data: {
        ongoing: Array<Tournament>;
        upcoming: Array<Tournament>;
        privates?: Array<Tournament>;
      }) => {
        if (
          data &&
          Array.isArray(data.ongoing) &&
          Array.isArray(data.upcoming)
        ) {
          const localTournaments = [...data.ongoing, ...data.upcoming];
          if (Array.isArray(data.privates)) {
            localTournaments.unshift(...data.privates);
          }
          setTournaments(localTournaments);
        }
      }
    );
  }

  function fetchLeagues() {
    fetchCall("/s/leagues", "GET", undefined, (data) => {
      if (Array.isArray(data)) {
        setLeagues(data);
      }
    });
  }

  useEffect(() => {
    if (Array.isArray(tournaments) && tournaments.length) {
      const localToday = [];
      const localSoon = [];
      const localLater = [];
      tournaments.forEach((tournament) => {
        const days = dateDiffInDays(
          new Date(),
          new Date(tournament.start_date)
        );
        if (days <= 0) {
          localToday.push(tournament);
        } else if (days < 7) {
          localSoon.push(tournament);
        } else {
          localLater.push(tournament);
        }
      });
      setToday(localToday);
      setSoon(localSoon);
      setLater(localLater);
    }
  }, [tournaments]);

  useEffect(() => {
    fetchTournaments();
    fetchLeagues();
  }, []);

  return (
    <div id={style.home}>
      <div id={style.image}>
        <div className={style.pane}>
          <div className={`${style.title}`}>
            <div>
              <Translated str="invitePairPlay" />
            </div>
            <div>
              <Translated str="onSpillsjakk" />
            </div>
            <div>
              <Translated str="homev2Desc" />
            </div>
          </div>
          <div className={style["action-buttons"]}>
            <a href="/about" className={style.button}>
              {Translated.byKey("readMore").toUpperCase()}
            </a>
            <a href="/login#account-modal=true" className={style.button}>
              {Translated.byKey("signup").toUpperCase()}
            </a>
          </div>
        </div>
      </div>
      {Array.isArray(today) &&
        today.length > 0 &&
        Array.isArray(soon) &&
        soon.length > 0 &&
        Array.isArray(later) &&
        later.length > 0 && (
          <div className={style.block}>
            <div className={style.heading}>
              {Translated.byKey("tournamentCalendar").toUpperCase()}
            </div>
            <HelpBox
              placement="top"
              name={helpboxNames.homeTournaments}
              text={Translated.byKey("homeTournamentsHelpbox")}
              show={user && user.authenticated === true}
            >
              <div className={style.wrapper}>
                {Array.isArray(today) && today.length > 0 && (
                  <div className={style.row}>
                    <div className={style.heading}>
                      {Translated.byKey("today").toUpperCase()}
                    </div>
                    <div className={style.content}>
                      {today.map((tournament, i) => (
                        <div key={i}>
                          <Card
                            id={tournament.id}
                            name={tournament.name}
                            timeControl={tournament.online_pairing_interval_n}
                            timeControlInterval={
                              tournament.online_pairing_interval_t
                            }
                            format={tournament.kind}
                            rounds={tournament.rounds}
                            startDate={tournament.first_online_pairing}
                            profile={tournament.profile_picture}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(soon) && soon.length > 0 && (
                  <div className={style.row}>
                    <div className={style.heading}>
                      {Translated.byKey("soon").toUpperCase()}
                    </div>
                    <div className={style.content}>
                      {soon.map((tournament, i) => (
                        <div key={i}>
                          <Card
                            id={tournament.id}
                            name={tournament.name}
                            timeControl={tournament.online_pairing_interval_n}
                            timeControlInterval={
                              tournament.online_pairing_interval_t
                            }
                            format={tournament.kind}
                            rounds={tournament.rounds}
                            startDate={tournament.first_online_pairing}
                            profile={tournament.profile_picture}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(later) && later.length > 0 && (
                  <div className={style.row}>
                    <div className={style.heading}>
                      {Translated.byKey("later").toUpperCase()}
                    </div>
                    <div className={style.content}>
                      {later.map((tournament, i) => (
                        <div key={i}>
                          <Card
                            id={tournament.id}
                            name={tournament.name}
                            timeControl={tournament.online_pairing_interval_n}
                            timeControlInterval={
                              tournament.online_pairing_interval_t
                            }
                            format={tournament.kind}
                            rounds={tournament.rounds}
                            startDate={tournament.first_online_pairing}
                            profile={tournament.profile_picture}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </HelpBox>
          </div>
        )}
      {Array.isArray(leagues) && leagues.length > 0 && (
        <div className={style.block}>
          <div className={style.heading}>
            {Translated.byKey("leagues").toUpperCase()}
          </div>
          <div className={style.wrapper}>
            {leagues.map((league) => (
              <League id={league.id} key={league.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { Home };
