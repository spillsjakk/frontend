import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Container } from "./container";
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