import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EditTournamentForm } from "./container";
import { WithTournamentForm } from "../../../hocs/tournament-form/index";
import { WithTournamentRound } from "../../../hocs/tournament-round";
import { WithTournament } from "../../../hocs/with-tournament";

const EditTournament: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Tournament-Edit";
  }, []);
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <WithTournament id={id}>
        <WithTournamentRound>
          <WithTournamentForm>
            <EditTournamentForm />
          </WithTournamentForm>
        </WithTournamentRound>
      </WithTournament>
    </>
  );
};
export { EditTournament };
