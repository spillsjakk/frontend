import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TournamentDetail } from "../../../context/tournament-detail";
import { Round } from "../../../context/tournament-round";
import { fetchJson, title } from "../../../functions";
import { sortByRank } from "../detail/index";
import { Helmet } from "react-helmet";
import Translated from "../../../components/translated";
import { Button } from "@material-ui/core";

function outcomeToStr(outcome: number | undefined) {
  switch (outcome) {
    case 1:
      return "1-0";
    case 0:
      return "½-½";
    case -1:
      return "0-1";
    default:
      return "*";
  }
}

const TournamentPairings: FunctionComponent<{}> = () => {
  const [tournamentDetail, setTournamentDetail] = useState<
    Partial<TournamentDetail>
  >({});
  const [rounds, setRounds] = useState<Array<Round>>([]);
  const params = useParams<{ tid: string; round: string }>();

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
        teams: tournamentDetail.teams.map((team) => ({
          ...team,
          id: team.name + team.seed,
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
    <div style={{ marginTop: "50px" }}>
      <br />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h4>
            <Translated str="round" /> {params.round}
          </h4>
        </div>
        <div>
          <Button onClick={() => window.print()}>
            <Translated str="print" />
          </Button>
        </div>
      </div>
      <Helmet>
        <title>
          {title(tournamentDetail?.tournament?.name || "tournament")}
        </title>
      </Helmet>
      <br />
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>
              <Translated str="boardNumber" />
            </th>
            <th>
              <Translated str="white" />
            </th>
            <th>
              <Translated str="result" />
            </th>
            <th>
              <Translated str="black" />
            </th>
          </tr>
        </thead>
        <tbody>
          {tournamentDetail?.pairings
            ?.filter((p) => p.round === Number(params.round))
            .map((pairing: any, i) => (
              <tr key={i}>
                <td>{pairing.boardNumber}</td>
                <td>{pairing.white_name}</td>
                <td>{outcomeToStr(pairing.outcome)}</td>
                <td>
                  {pairing.black === "bye" ? pairing.black : pairing.black_name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export { TournamentPairings };
