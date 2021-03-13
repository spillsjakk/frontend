import React, { FunctionComponent } from "react";
import Translated from "../../components/translated";
import style from "./style.module.scss";
import { FormStepper } from "./stepper";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <div id={style.heading}>
        {Translated.byKey("buildTournament").toUpperCase()}
      </div>
      <FormStepper />
    </>
  );
};

export { BuildTournament };
