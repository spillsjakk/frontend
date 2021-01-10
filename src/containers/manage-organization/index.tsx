import React, { FunctionComponent } from "react";
import { SummaryCard } from "../../components/summary-card";
import Translated from "../../components/translated";
import style from "./style.module.scss";
import { DetailSummaryContent } from "./summary/detail-content";
import { StatsSummary } from "./summary/stats";
import { ClubsSummary } from "./summary/clubs";
import { AccountsSummary } from "./summary/accounts";
import { SharePowerSummary } from "./summary/share-power";
import { Col, Row } from "react-bootstrap";
import { useManageOrganizationPopup } from "../../context/manage-organization-popup";

const ManageOrganization: FunctionComponent<{}> = () => {
  const {
    openDetailEdit,
    openStats,
    openClubList,
    openPowerShare,
    openPlayerList,
  } = useManageOrganizationPopup();
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
        <SummaryCard
          onAction={() => {
            openStats();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<StatsSummary />}
        />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard
          onAction={() => {
            openClubList();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          content={<ClubsSummary />}
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

export { ManageOrganization };
