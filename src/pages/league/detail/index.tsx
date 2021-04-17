import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WithLeague } from "../../../hocs/with-league/index";
import "./style.scss";
import { Banner } from "./banner";
import { Description } from "./description";
import { Header } from "./header";
import { Name } from "./name";
import style from "./style.module.scss";
import { WithUserOrgsClubs } from "../../../hocs/user-orgs-and-clubs";

const LeagueDetail: FunctionComponent<{}> = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "league-detail";
  }, []);
  return (
    <WithLeague id={leagueId}>
      <WithUserOrgsClubs>
        <div className={style.wrapper}>
          <Header />
          <Banner />
          <Name />
          <Description />
        </div>
      </WithUserOrgsClubs>
    </WithLeague>
  );
};

export { LeagueDetail };
