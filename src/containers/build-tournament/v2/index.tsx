import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const BuildTournament: FunctionComponent<{}> = () => {
  return (
    <>
      <div className={style.heading}>
        {Translated.byKey("buildTournament").toUpperCase()}
      </div>
    </>
  );
};

export { BuildTournament };
