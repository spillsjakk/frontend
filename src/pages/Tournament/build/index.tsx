import React, { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BuildTournament as Container } from "../../../containers/build-tournament/v2";
import { title } from "../../../functions";
import { WithTournamentForm } from "../../../hocs/tournament-form/index";

const BuildTournament: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Build";
  }, []);
  return (
    <>
      <Helmet>
        <title>{title("buildTournament")}</title>
      </Helmet>
      <WithTournamentForm>
        <Container />
      </WithTournamentForm>
    </>
  );
};
export { BuildTournament };
