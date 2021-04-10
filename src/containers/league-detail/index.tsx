import React, { FunctionComponent, useEffect } from "react";
import { Banner } from "./banner";
import { Description } from "./description";
import { Header } from "./header";
import { Name } from "./name";
import style from "./style.module.scss";

const LeagueDetail: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "league-detail";
  }, []);
  return (
    <div className={style.wrapper}>
      <Header />
      <Banner />
      <Name />
      <Description />
    </div>
  );
};

export { LeagueDetail };
