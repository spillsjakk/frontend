import React, { FunctionComponent } from "react";
import { SummaryCard } from "../../components/summary-card";
import Translated from "../../components/translated";
import style from "./style.module.scss";
import { DetailSummaryContent } from "./summary/detail-content";
import { StatsSummary } from "./summary/stats";
import { TeamsSummary } from "./summary/teams";
import { AccountsSummary } from "./summary/accounts";
import { SharePowerSummary } from "./summary/share-power";
import { Col, Row } from "react-bootstrap";
import { useManageClubPopup } from "../../context/manage-club-popup";

const ManageClub: FunctionComponent<{}> = () => {
  const {
    openDetailEdit,
    openStats,
    openClubList,
    openPowerShare,
    openPlayerList,
  } = useManageClubPopup();
  return (
    <Row className={style.row}>
      <Col className={style.col} xs="auto">
        <SummaryCard
          onAction={() => {
            openDetailEdit();
          }}
          actionName={Translated.byKey("update").toUpperCase()}
          content={<DetailSummaryContent />}
        />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard content={<StatsSummary />} />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard
          onAction={() => {
            openClubList();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<TeamsSummary />}
        />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard
          onAction={() => {
            openPlayerList();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<AccountsSummary />}
        />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard
          onAction={() => {
            openPowerShare();
          }}
          actionName={Translated.byKey("custom").toUpperCase()}
          content={<SharePowerSummary />}
        />
      </Col>
    </Row>
  );
};

export { ManageClub };
