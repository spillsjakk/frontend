import React, { FunctionComponent, useEffect } from "react";
import { BuildTournament as Container } from "../../../containers/build-tournament/index";
import { WithTournamentForm } from "../../../hocs/tournament-form/index";

const BuildTournament: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Build";
  }, []);
  return (
    <>
      <WithTournamentForm>
        <Container />
      </WithTournamentForm>
    </>
  );
};
export { BuildTournament };
