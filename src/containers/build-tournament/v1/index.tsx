import React, { FunctionComponent } from "react";
import { BuildTournamentForm } from "../../../components/build-tournament-form";
import { ShortForm } from "../../../components/build-tournament-form/short";
import { WithBuildTournamentTemplate } from "../../../hocs/build-tournament-template";
import Translated from "../../../components/translated";
import { SelectTemplate } from "./select-template";
import { Continue } from "./continue";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <h1 className="mt-5 p-3">
        <Translated str="buildTournament" />
      </h1>
      <WithBuildTournamentTemplate>
        <SelectTemplate />
        <ShortForm />
        <Continue />
      </WithBuildTournamentTemplate>
      <BuildTournamentForm />
    </>
  );
};
export { BuildTournament };
