import React, { FunctionComponent } from "react";
import { Header } from "./header";
import { Banner } from "./banner";
import { Description } from "./description";
import { TimeSection } from "./time-section";
import { Name } from "./name";
import { Standings } from "./standings";
import { Pairings } from "./pairings";
import style from "./style.module.scss";

const TournamentDetail: FunctionComponent<{}> = () => {
  return (
    <div className={style.wrapper}>
      <Header />
      <Banner />
      <Name />
      <Description />
      <TimeSection />
      <Standings />
      <Pairings defaultMiniboards={true} />
    </div>
  );
};

export { TournamentDetail };
