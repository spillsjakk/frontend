import React, { FunctionComponent, memo } from "react";
import style from "./style.module.scss";
import { useLeague, WithLeague } from "../../hocs/with-league/index";
import { Card } from "../../components/tournament-card/card";
import { Link } from "react-router-dom";

const Tournaments: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();

  return (
    <>
      {league && league.league && (
        <div className={style.row}>
          <div className={style.heading}>
            <Link to={`/league/view/${league.league.id}`}>
              {league.league.name}
            </Link>
          </div>
          <div className={style.content}>
            {league.tournaments &&
              Array.isArray(Object.keys(league.tournaments)) &&
              Object.keys(league.tournaments).map((season) =>
                league.tournaments[season].map((tournament) => (
                  <Card
                    id={tournament.id}
                    name={tournament.name}
                    timeControl={tournament.online_pairing_interval_n}
                    timeControlInterval={tournament.online_pairing_interval_t}
                    format={tournament.kind}
                    rounds={tournament.rounds}
                    startDate={tournament.first_online_pairing}
                    profile={tournament.profile_picture}
                    key={tournament.id}
                  />
                ))
              )}
          </div>
        </div>
      )}
    </>
  );
});

interface Props {
  id: string;
}

const League: FunctionComponent<Props> = ({ id }) => {
  return (
    <WithLeague id={id}>
      <Tournaments />
    </WithLeague>
  );
};

export { League };
