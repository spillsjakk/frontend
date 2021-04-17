import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "./container";
import { WithLeague } from "../../../hocs/with-league/index";
import "./style.scss";

const LeagueDetail: FunctionComponent<{}> = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "league-detail";
  }, []);
  return (
    <WithLeague id={leagueId}>
      <Container />
    </WithLeague>
  );
};

export { LeagueDetail };
