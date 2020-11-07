import React, { FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fetchJson } from "../../functions";
import { Tournament } from "../../pages/Tournament/Types";
import style from "./style.module.scss";

const Tournaments: FunctionComponent<{}> = () => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);

  const history = useHistory();

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

  function onTournamentClick(id: string) {
    history.push(`/tournament/view/${id}`);
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
              <div
                className={`${style.tournament} box escalate`}
                onClick={() => onTournamentClick(tournament.id)}
              >
                <img src="/images/placeholder/tournament-thumbnail.jpg" />
                <div className={style.content}>
                  <div className={style.first}>
                    <div className={style.name}>{tournament.name}</div>
                    <div className={style.date}>{tournament.start_date}</div>
                  </div>
                  <div className={style.second}>
                    <div className={style.description}>
                      {tournament.description}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};
export { Tournaments };
