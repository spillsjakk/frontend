import React, { FunctionComponent, memo } from "react";
import style from "./style.module.scss";
import { useLeague, WithLeague } from "../../hocs/with-league/index";
import { LeagueCard } from "../../components/league-card";

const Tournaments: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();

  return (
    <div className={style.row}>
      {league && league.league && (
        <LeagueCard
          id={league.league.id}
          name={league.league.name}
          profile={league.league.profile_picture}
        />
      )}
    </div>
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
