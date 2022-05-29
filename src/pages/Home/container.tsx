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

export function categorizeTournaments(tournaments: Array<Tournament>): {
  today: Array<Tournament>;
  tomorrow: Array<Tournament>;
  soon: Array<Tournament>;
  later: Array<Tournament>;
} {
  // until 23:59 of today
  const today = [];
  const todayMidnight = new Date();
  todayMidnight.setHours(23, 59, 59, 999);

  // until 23:59 of tomorrow
  const tomorrow = [];
  const tomorrowMidnight = new Date();
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  tomorrowMidnight.setHours(23, 59, 59, 999);

  // until 23:59 of next week
  const soon = [];
  const nextWeekMidnight = new Date();
  nextWeekMidnight.setDate(nextWeekMidnight.getDate() + 7);
  nextWeekMidnight.setHours(23, 59, 59, 999);

  // after next week
  const later = [];

  tournaments.forEach((tournament) => {
    const tournamentStartDate = new Date(tournament.start_date);
    if (tournamentStartDate < todayMidnight) {
      today.push(tournament);
    } else if (tournamentStartDate < tomorrowMidnight) {
      tomorrow.push(tournament);
    } else if (tournamentStartDate < nextWeekMidnight) {
      soon.push(tournament);
    } else {
      later.push(tournament);
    }
  });

  return {
    today,
    tomorrow,
    soon,
    later,
  };
}

const Home: FunctionComponent<{}> = () => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  const [today, setToday] = useState<Array<Tournament>>([]);
  const [tomorrow, setTomorrow] = useState<Array<Tournament>>([]);
  const [soon, setSoon] = useState<Array<Tournament>>([]);
  const [later, setLater] = useState<Array<Tournament>>([]);
  const [pinned, setPinned] = useState<Array<Tournament>>([]);
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
        pinned?: Array<Tournament>;
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
        setPinned(data.pinned || []);
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
      const categoriedTournaments = categorizeTournaments(tournaments);
      setToday(categoriedTournaments.today);
      setTomorrow(categoriedTournaments.tomorrow);
      setSoon(categoriedTournaments.soon);
      setLater(categoriedTournaments.later);
    }
  }, [tournaments]);

  useEffect(() => {
    fetchTournaments();
    fetchLeagues();
  }, []);

  return (
    <div id={style.home}>
      <div id={style.image}>
        <div className={style.pane}></div>
      </div>
      {((Array.isArray(today) && today.length > 0) ||
        (Array.isArray(soon) && soon.length > 0) ||
        (Array.isArray(pinned) && pinned.length > 0) ||
        (Array.isArray(later) && later.length > 0)) && (
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
              {Array.isArray(pinned) && pinned.length > 0 && (
                <div className={style.row}>
                  <div className={style.heading}>
                    {Translated.byKey("pinned").toUpperCase()}
                  </div>
                  <div className={style.content}>
                    {pinned.map((tournament, i) => (
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
                          startDate={tournament.current_online_pairing_time}
                          profile={tournament.profile_picture}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                          startDate={tournament.current_online_pairing_time}
                          profile={tournament.profile_picture}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(tomorrow) && tomorrow.length > 0 && (
                <div className={style.row}>
                  <div className={style.heading}>
                    {Translated.byKey("tomorrow").toUpperCase()}
                  </div>
                  <div className={style.content}>
                    {tomorrow.map((tournament, i) => (
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
                          startDate={tournament.current_online_pairing_time}
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
          <div className={style.emptyheading}>
            {Translated.byKey("leagues").toUpperCase()}
          </div>
          <div className={style.leaguewrapper}>
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
