import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../context/tournament-detail";
import { Col, Row } from "react-bootstrap";
import Translated from "../../components/Translated";

import style from "./style.module.scss";

const Description: FunctionComponent<{}> = () => {
  const { tournament } = useTournamentDetail();
  return (
    <div className={style["description-container"]}>
      <Row style={{ width: "100%", margin: "0px" }}>
        <Col xs={12} md={8}>
          <div className={style.about}>
            <div className={style.heading}>ABOUT:</div>
            <p>{tournament?.description}</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className={style.info}>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>Time Control: </div>
              <p>
                {tournament?.initial_time} minutes + {tournament?.increment}{" "}
                minutes increment
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
                  `${tournament.per_team_limit} per team`}
              </div>
              <p>{/* {TODO: tournament kind's description} */}</p>
            </div>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>Number of Rounds</div>
              <p>{tournament?.rounds} rounds</p>
            </div>
            <div className={`${style.box} ${style.item}`}>
              <div className={style.heading}>Start Date - End Date</div>
              <p>
                {tournament?.start_date} - {tournament?.end_date}
              </p>
            </div>
            <div className={style["join-tournament"]}>
              <button>Join Tournament</button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export { Description };
