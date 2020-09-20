import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { BuildTournamentForm } from "../../components/build-tournament-form";
import { ShortForm } from "../../components/build-tournament-form/short";
import { WithBuildTournamentTemplate } from "../../hocs/build-tournament-template";
import Translated from "../../components/Translated";
import { title } from "../../functions";
import { SelectTemplate } from "./select-template";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <Helmet>
        <title>{title("buildTournament")}</title>
      </Helmet>
      <h1 className="mt-5 p-3">
        <Translated str="buildTournament" />
      </h1>
      <WithBuildTournamentTemplate>
        <SelectTemplate />
        <ShortForm />
      </WithBuildTournamentTemplate>
      <BuildTournamentForm />
    </>
  );
};
export { BuildTournament };
