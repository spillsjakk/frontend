import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { LeagueDetail as Container } from "../../../containers/league-detail/index";
import { WithLeague } from "../../../hocs/with-league/index";
import "./style.scss";

const LeagueDetail: FunctionComponent<{}> = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  return (
    <WithLeague id={leagueId}>
      <Container />
    </WithLeague>
  );
};

export { LeagueDetail };
