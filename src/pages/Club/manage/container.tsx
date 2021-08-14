import React, { FunctionComponent } from "react";
import { SummaryCard } from "../../../components/summary-card";
import Translated from "../../../components/translated";
import style from "./style.module.scss";
import { DetailSummaryContent } from "./summary/detail-content";
import { StatsSummary } from "./summary/stats";
import { TeamsSummary } from "./summary/teams";
import { AccountsSummary } from "./summary/accounts";
import { TournamentList } from "./summary/tournament";
import { SharePowerSummary } from "./summary/share-power";
import { MessageSummary } from "./summary/message";
import { Grid } from "@material-ui/core";
import { useManageClubPopup } from "../../../context/manage-club-popup";

const ManageClub: FunctionComponent<{}> = () => {
  const {
    openDetailEdit,
    openClubList,
    openPlayerList,
    openAccountsWithPowers,
    openStats,
  } = useManageClubPopup();
  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignItems="center"
      className={style.row}
    >
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard
          onAction={() => {
            openDetailEdit();
          }}
          actionName={Translated.byKey("update").toUpperCase()}
          content={<DetailSummaryContent />}
        />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard
          onAction={() => {
            openStats();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<StatsSummary />}
        />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard
          onAction={() => {
            openClubList();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<TeamsSummary />}
        />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard
          onAction={() => {
            openPlayerList();
          }}
          onSecondAction={() => {
            openAccountsWithPowers();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          secondActionName={Translated.byKey(
            "accountsWithPowers"
          ).toUpperCase()}
          content={<AccountsSummary />}
        />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard content={<SharePowerSummary />} />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard content={<MessageSummary />} />
      </Grid>
      <Grid item className={style.col} xs={12} sm={12} md={6} lg={4}>
        <SummaryCard
          onAction={() => {
            openClubList();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<TournamentList />}
        />
      </Grid>
    </Grid>
  );
};

export { ManageClub };
