import React, { FunctionComponent, useEffect, useState } from "react";
import "./style.scss";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  TournamentDetailProvider,
  TournamentDetail as ITournamentDetail,
} from "../../../context/tournament-detail";
import { fetchJson, title } from "../../../functions";
import { TournamentDetail as Container } from "../../../containers/tournament-detail";
import { Round } from "../../../context/tournament-round";

const TournamentDetail: FunctionComponent<{}> = () => {
  const [tournamentDetail, setTournamentDetail] = useState<
    Partial<ITournamentDetail>
  >({});
  const [rounds, setRounds] = useState<Array<Round>>([]);

  const params = useParams<{ tid: string }>();

  function fetchTournament() {
    fetchJson("/s/tournament/view/" + params.tid, "GET", undefined, (json) => {
      setTournamentDetail(json);
    });
  }

  async function fetchRounds() {
    fetch(`/s/rounds?tournament=${tournamentDetail.tournament?.id}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status < 400) {
        const result = response.json();
        if (Array.isArray(result)) {
          setRounds(result);
        }
      }
    });
  }

  useEffect(() => {
    if (tournamentDetail.tournament && tournamentDetail.tournament.id) {
      fetchRounds();
    }
  }, [tournamentDetail]);

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "tournament-detail";
    fetchTournament();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {title(tournamentDetail?.tournament?.name || "tournament")}
        </title>
      </Helmet>
      <TournamentDetailProvider
        value={{ ...tournamentDetail, rounds, update: fetchTournament }}
      >
        <div
          style={{
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container />
        </div>
      </TournamentDetailProvider>
    </>
  );
};

export { TournamentDetail };
