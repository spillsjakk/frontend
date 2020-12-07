import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title } from "../../functions";
import { EditTournamentForm } from "../../components/edit-tournament-form";

const EditTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <Helmet>
        <title>{title("editTournament")}</title>
      </Helmet>
      <h1 className="mt-5 p-3">
        <Translated str="editTournament" />
      </h1>
      <EditTournamentForm />
    </>
  );
};
export { EditTournament };
