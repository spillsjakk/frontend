import React, { FunctionComponent, useEffect, useState } from "react";
import { HelpBox, helpboxNames } from "../../../components/help-box";
import Translated from "../../../components/translated";
import { useUser } from "../../../components/UserContext";
import { fetchCall } from "../../../functions";
import { Tournament } from "../../../pages/Tournament/Types";
import { Card } from "./card";
import style from "./style.module.scss";

const Home: FunctionComponent<{}> = () => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);

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

  useEffect(() => {
    fetchTournaments();
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
            <div className={style.button}>
              {Translated.byKey("readMore").toUpperCase()}
            </div>
            <div className={style.button}>
              {Translated.byKey("signup").toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      <div className={style.calendar}>
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
            <div className={style.row}>
              <div className={style.heading}>TODAY</div>
              <div className={style.content}>
                {Array.isArray(tournaments) &&
                  tournaments.map((tournament, i) => (
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
          </div>
        </HelpBox>
      </div>
    </div>
  );
};

export { Home };
