import React, { FunctionComponent, memo } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";
import { Card } from "../../../components/tournament-card/card";
import { CrossTablePopup } from "./crosstable-popup";

const Tournaments: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();

  return (
    <>
      <div className={style["tournament-row"]}>
        {league &&
          league.tournaments &&
          Array.isArray(Object.keys(league.tournaments)) &&
          Object.keys(league.tournaments).map((season, i) => (
            <div key={i}>
              <div className={style.heading}>
                <div>{season}</div>
                <div className={style.crosstable}>
                  <CrossTablePopup />
                </div>
              </div>
              <div className={style.content} key={i}>
                {league.tournaments[season].map((tournament, i) => (
                  <div key={i}>
                    <Card
                      id={tournament.id}
                      name={tournament.name}
                      timeControl={tournament.online_pairing_interval_n}
                      timeControlInterval={tournament.online_pairing_interval_t}
                      format={tournament.kind}
                      rounds={tournament.rounds}
                      startDate={tournament.first_online_pairing}
                      profile={tournament.profile_picture}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
});

export { Tournaments };
