import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import style from "./style.module.scss";
import { Steps } from "./steps";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <div id={style.heading}>
        {Translated.byKey("buildTournament").toUpperCase()}
      </div>
      <Steps />
    </>
  );
};

export { BuildTournament };
