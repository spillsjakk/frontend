import React, { FunctionComponent, useEffect } from "react";
import "./style.scss";
import { Helmet } from "react-helmet";
import { BuildTournament as Container } from "../../../containers/build-tournament/v2";
import { title } from "../../../functions";
import { WithBuildTournamentTemplate } from "../../../hocs/build-tournament-template";
import { WithTournamentForm } from "../../../hocs/tournament-form/index";

const BuildTournament: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Build";
  }, []);
  return (
    <main>
      <Helmet>
        <title>{title("buildTournament")}</title>
      </Helmet>
      <WithTournamentForm>
        <WithBuildTournamentTemplate>
          <Container />
        </WithBuildTournamentTemplate>
      </WithTournamentForm>
    </main>
  );
};
export { BuildTournament };
