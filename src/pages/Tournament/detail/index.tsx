import React, { FunctionComponent, useEffect, useState } from "react";
import "./style.scss";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  TournamentDetailProvider,
  TournamentDetail as ITournamentDetail,
} from "../../../context/tournament-detail";
import { fetchJson, title } from "../../../functions";
import { Round } from "../../../context/tournament-round";
import { Header } from "./header";
import { Banner } from "./banner";
import { Description } from "./description";
import { TimeSection } from "./time-section";
import { Name } from "./name";
import { Standings } from "./standings";
import { Pairings } from "./pairings";
import style from "./style.module.scss";
import { WithOnlineStatus } from "../../../hocs/with-online-statuses";

export function sortByRank(a, b) {
  if (a.score === b.score) {
    if (a.tb1 === b.tb1) {
      if (a.tb2 === b.tb2) {
        if (a.tb3 === b.tb3) {
          return b.tb4 - a.tb4;
        }
        return b.tb3 - a.tb3;
      }
      return b.tb2 - a.tb2;
    }
    return b.tb1 - a.tb1;
  }
  return a.score > b.score ? -1 : 1;
}

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
    }).then(async (response) => {
      if (response.status < 400) {
        const result = await response.json();
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
    if (
      tournamentDetail &&
      !tournamentDetail.sorted &&
      Array.isArray(tournamentDetail.participants)
    ) {
      // sorting participants and adding ranks
      tournamentDetail.participants.sort(sortByRank);
      let tempRound = null;
      let boardNumber = 1;
      setTournamentDetail({
        ...tournamentDetail,
        participants: tournamentDetail.participants.map((participant, i) => {
          const opponentRatings = [];
          const opponenScores = [];
          tournamentDetail.pairings.forEach((pairing) => {
            if (pairing.white === participant.account) {
              const blackParticipant = tournamentDetail.participants.find(
                (participant) => participant.account === pairing.black
              );
              if (blackParticipant && blackParticipant.fide_rating) {
                opponentRatings.push(blackParticipant.fide_rating);
                opponenScores.push(blackParticipant.score);
              }
            } else if (pairing.black === participant.account) {
              const whiteParticipant = tournamentDetail.participants.find(
                (participant) => participant.account === pairing.white
              );
              if (whiteParticipant && whiteParticipant.fide_rating) {
                opponentRatings.push(whiteParticipant.fide_rating);
                opponenScores.push(whiteParticipant.score);
              }
            }
          });
          const averageOpponentRating =
            opponentRatings.reduce((acc, cur) => acc + cur, 0) /
            opponentRatings.length;
          const averageOpponentScore =
            opponenScores.reduce((acc, cur) => acc + cur, 0) /
            opponenScores.length;
          const performanceRating =
            averageOpponentRating && averageOpponentScore
              ? Math.floor(
                  averageOpponentRating + (averageOpponentScore * 800 - 400)
                )
              : 0;
          return {
            rank: i + 1,
            id: participant.account,
            averageOpponentRating,
            averageOpponentScore,
            performanceRating,
            ...participant,
          };
        }),
        pairings: tournamentDetail.pairings.map((pairing) => {
          if (tempRound !== null && tempRound !== pairing.round) {
            boardNumber = 1;
          }
          tempRound = pairing.round;
          return {
            ...pairing,
            boardNumber: boardNumber++,
            id: pairing.white_name + pairing.black_name + pairing.round,
          };
        }),
        teams: tournamentDetail.teams.map((team, i) => ({
          ...team,
          id: team.name + team.seed,
          rank: i + 1,
        })),
        sorted: true,
        currentRoundNumbers: Array.from(
          new Set(tournamentDetail.pairings.map((p) => p.round))
        ),
      });
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
          <div className={style.wrapper}>
            <Header />
            <Banner />
            <Name />
            <Description />
            <TimeSection />
            <WithOnlineStatus
              accounts={tournamentDetail?.participants?.map((p) => p.account)}
            >
              <Standings />
              <Pairings
                defaultMiniboards={!tournamentDetail?.tournament?.default_otb}
              />
            </WithOnlineStatus>
          </div>
        </div>
      </TournamentDetailProvider>
    </>
  );
};

export { TournamentDetail };
