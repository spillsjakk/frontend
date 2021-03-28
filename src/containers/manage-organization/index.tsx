import React, { FunctionComponent } from "react";
import { SummaryCard } from "../../components/summary-card";
import Translated from "../../components/translated";
import style from "./style.module.scss";
import { DetailSummaryContent } from "./summary/detail-content";
import { StatsSummary } from "./summary/stats";
import { ClubsSummary } from "./summary/clubs";
import { AccountsSummary } from "./summary/accounts";
import { SharePowerSummary } from "./summary/share-power";
import { MessageSummary } from "./summary/message";
import { Col, Row } from "react-bootstrap";
import { useManageOrganizationPopup } from "../../context/manage-organization-popup";

const ManageOrganization: FunctionComponent<{}> = () => {
  const {
    openDetailEdit,
    openStats,
    openClubList,
    openPlayerList,
    openAccountsWithPowers,
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
          onSecondAction={() => {
            openAccountsWithPowers();
          }}
          actionName={Translated.byKey("expandAll").toUpperCase()}
          secondActionName={Translated.byKey(
            "accountsWithPowers"
          ).toUpperCase()}
          content={<AccountsSummary />}
        />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard content={<SharePowerSummary />} />
      </Col>
      <Col className={style.col} xs="auto">
        <SummaryCard content={<MessageSummary />} />
      </Col>
    </Row>
  );
};

export { ManageOrganization };
