import React, { FunctionComponent } from "react";
import xssFilters from "xss-filters";
import { useTournamentDetail } from "../../../context/tournament-detail";
import { Col, Row } from "react-bootstrap";
import Translated from "../../../components/translated";
import { ActionButton } from "./action-button";

import style from "./style.module.scss";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const Description: FunctionComponent<{}> = () => {
  const { tournament, rounds, league } = useTournamentDetail();

  return (
    <div className={style["description-container"]}>
      <Row style={{ width: "100%", margin: "0px" }}>
        <Col xs={12} md={8}>
          <div className={style.about}>
            <div className={style.heading}>
              {Translated.byKey("about").toUpperCase()}:
            </div>
            <ReactMarkdown linkTarget="_blank">
              {xssFilters.inHTMLData(tournament?.description || "")}
            </ReactMarkdown>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className={style.info}>
            {league && (
              <div className={`${style.box} ${style.item}`}>
                <div className={style.heading}>
                  {Translated.byKey("league")}
                </div>
                <p>
                  <Link to={`/league/view/${league.league_id}`}>
                    {league.league_name}
                  </Link>
                </p>
              </div>
            )}
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
                <Translated str="format" />
              </div>
              <p>
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
              </p>
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
                {`${new Date(
                  tournament?.first_online_pairing
                ).toLocaleDateString()} ${new Date(
                  tournament?.first_online_pairing
                ).toLocaleTimeString()} - ${new Date(
                  tournament?.end_date
                ).toLocaleDateString()}`}
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
