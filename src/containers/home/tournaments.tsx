import React, { FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { fetchJson } from "../../functions";
import { Tournament } from "../../pages/Tournament/Types";
import style from "./style.module.scss";

const Tournaments: FunctionComponent<{}> = () => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);

  function fetchTournaments() {
    fetchJson(
      "/s/tournament/find",
      "GET",
      undefined,
      (data: { ongoing: Array<Tournament>; upcoming: Array<Tournament> }) => {
        if (
          data &&
          Array.isArray(data.ongoing) &&
          Array.isArray(data.upcoming)
        ) {
          setTournaments([...data.ongoing, ...data.upcoming]);
        }
      }
    );
  }

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div>
      <Row className={style.row}>
        {Array.isArray(tournaments) &&
          tournaments.map((tournament, i) => (
            <Col key={i} className={style.column} xs={12} sm={6} md={4} xl={3}>
              <div className={`${style.tournament} box`}>
                <img src="/images/placeholder/tournament-thumbnail.jpg" />
                {tournament.name}
                {tournament.description}
              </div>
            </Col>
          ))}
        {Array.isArray(tournaments) &&
          tournaments.map((tournament, i) => (
            <Col key={i} className={style.column} xs={12} sm={6} md={4} xl={3}>
              <div className={`${style.tournament} box`}>
                <img src="/images/placeholder/tournament-thumbnail.jpg" />
                {tournament.name}
                {tournament.description}
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};
export { Tournaments };
