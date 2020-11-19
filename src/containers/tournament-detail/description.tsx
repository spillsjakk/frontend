import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import { Col, Row } from "react-bootstrap";
import Translated from "../../components/Translated";
import { ActionButton } from "./action-button";

import style from "./style.module.scss";

const Description: FunctionComponent<{}> = () => {
  const { tournament, rounds } = useTournamentDetail();

  return (
    <div className={style["description-container"]}>
      <Row style={{ width: "100%", margin: "0px" }}>
        <Col xs={12} md={8}>
          <div className={style.about}>
            <div className={style.heading}>
              {Translated.byKey("about").toUpperCase()}:
            </div>
            <p>{tournament?.description}</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className={style.info}>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>
                {Translated.byKey("timeControl")}
              </div>
              <p>
                {tournament?.initial_time} minutes + {tournament?.increment}{" "}
                seconds increment
              </p>
            </div>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>
                <Translated
                  str={
                    tournament
                      ? tournament.kind.charAt(0).toLowerCase() +
                        tournament.kind.slice(1)
                      : ""
                  }
                />
                {tournament?.per_team_limit &&
                  ` - ${tournament.per_team_limit} per team`}
              </div>
              <p>{/* {TODO: tournament kind's description} */}</p>
            </div>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>
                {Translated.byKey("numberOfRounds")}
              </div>
              {tournament?.kind === "ManualPairing" ? (
                Array.isArray(rounds) &&
                rounds.length > 0 && (
                  <p>
                    {rounds.length} {Translated.byKey("rounds")}
                  </p>
                )
              ) : (
                <p>
                  {tournament?.rounds} {Translated.byKey("rounds")}
                </p>
              )}
            </div>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>
                {Translated.byKey("startDate")} - {Translated.byKey("endDate")}
              </div>
              <p>
                {tournament?.start_date} - {tournament?.end_date}
              </p>
            </div>
            <ActionButton />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export { Description };
