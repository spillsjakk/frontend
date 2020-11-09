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

const TournamentDetail: FunctionComponent<{}> = () => {
  const [tournamentDetail, setTournamentDetail] = useState<
    Partial<ITournamentDetail>
  >({});

  const params = useParams<{ tid: string }>();

  function fetchTournament() {
    fetchJson("/s/tournament/view/" + params.tid, "GET", undefined, (json) => {
      setTournamentDetail(json);
    });
  }

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
      <TournamentDetailProvider value={tournamentDetail}>
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
