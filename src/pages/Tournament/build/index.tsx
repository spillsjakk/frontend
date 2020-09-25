import React, { FunctionComponent, useEffect } from "react";
import { BuildTournament as Container } from "../../../containers/build-tournament/index";
import { WithBuildTournamentForm } from "../../../hocs/build-tournament-form/index";

const BuildTournament: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Build";
  }, []);
  return (
    <>
      <WithBuildTournamentForm>
        <Container />
      </WithBuildTournamentForm>
    </>
  );
};
export { BuildTournament };
