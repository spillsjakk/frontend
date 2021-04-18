import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WithLeague } from "../../../hocs/with-league/index";
import "./style.scss";
import { Season } from "./season";
import { Category } from "./category";
import { Header } from "./header";
import { Name } from "./name";
import { Banner } from "./banner";
import { Description } from "./description";
import style from "./style.module.scss";
import { Grid } from "@material-ui/core";
import { WithUserOrgsClubs } from "../../../hocs/user-orgs-and-clubs";
import { Tournament } from "./tournament";
import { fetchCall } from "../../../functions";

const LeagueManage: FunctionComponent<{}> = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "league-manage";
    fetchCall(
      `/s/leagues/${leagueId}/permissions`,
      "GET",
      undefined,
      (result) => {
        if (!result?.can_manage) {
          window.location.replace("/");
        }
      }
    );
  }, []);
  return (
    <WithLeague id={leagueId}>
      <WithUserOrgsClubs>
        <div className={style.wrapper}>
          <Header />
          <Banner />
          <Name />
          <Description />
          <Grid
            className={style["mt-2"]}
            justify="space-around"
            container
            spacing={3}
          >
            <Grid item xs={12}>
              <Season />
            </Grid>
            <Grid item xs={12}>
              <Category />
            </Grid>
            <Grid item xs={12}>
              <Tournament />
            </Grid>
          </Grid>
        </div>
      </WithUserOrgsClubs>
    </WithLeague>
  );
};

export { LeagueManage };
