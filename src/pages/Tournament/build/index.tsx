import React, { FunctionComponent } from "react";
import { BuildTournament as Container } from "../../../containers/build-tournament/index";
import { WithBuildTournamentForm } from "../../../hocs/build-tournament-form/index";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <WithBuildTournamentForm>
        <Container />
      </WithBuildTournamentForm>
    </>
  );
};
export { BuildTournament };
