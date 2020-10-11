import React, { FunctionComponent, useEffect } from "react";
import { EditTournament as Container } from "../../../containers/edit-tournament/index";
import { WithTournamentForm } from "../../../hocs/tournament-form/index";

const EditTournament: FunctionComponent<{}> = () => {
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
export { EditTournament };
