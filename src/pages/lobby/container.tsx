/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridPageChangeParams,
} from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { TimestampString } from "../../components/Timestamp";
import Translated from "../../components/translated";
import { fetchJson } from "../../functions";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import {
  TournamentDetail,
  TournamentDetailProvider,
} from "../../context/tournament-detail";
import { Round } from "../../context/tournament-round";
import { Pairings } from "../Tournament/detail/pairings";

const commonFields = {
  headerClassName: "table-header",
  cellClassName: "table-cell",
};

type Tournament = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

type Game = {
  id: string;
  white_name: string;
  black_name: string;
  start: string;
  tournament_name: string;
  initial_time: number;
  increment: number;
  outcome: number;
};

const TournamentSchedule: FunctionComponent<{ userId?: string }> = ({
  userId,
}) => {
  const [tournamentDetail, setTournamentDetail] = useState<
    Partial<TournamentDetail>
  >({});
  const [rounds, setRounds] = useState<Array<Round>>([]);
  const [pageSize, setPageSize] = React.useState<number>(15);

  const [tournamentData, setTournamentData] = useState<any>();
  const tournamentColumns: GridColDef[] = [
    {
      field: "tournament",
      headerName: Translated.byKey("tournament"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
      minWidth: 390,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/tournament/view/" + params.row.id}>
              {params.row.name}
            </Link>
          </>
        );
      },
    },
    {
      field: "start_date",
      headerName: Translated.byKey("startDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 200,
      ...commonFields,
    },
    {
      field: "end_date",
      headerName: Translated.byKey("endDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 200,
      ...commonFields,
    },
  ];
  const [gameData, setGameData] = useState<any>();
  const gameColumns: GridColDef[] = [
    {
      field: "game",
      headerName: Translated.byKey("game"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
      minWidth: 300,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/game/view/" + params.row.id}>{params.row.name}</Link>
          </>
        );
      },
    },
    {
      field: "start",
      headerName: Translated.byKey("dateTime"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 300,
      ...commonFields,
    },
    {
      field: "tournament",
      headerName: Translated.byKey("tournament"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 300,
      ...commonFields,
    },
    {
      field: "timeControl",
      headerName: Translated.byKey("timeControl"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 150,
      ...commonFields,
    },
    {
      field: "result",
      headerName: Translated.byKey("result"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 150,
      ...commonFields,
    },
  ];

  function fetchTournament(id: string) {
    fetchJson("/s/tournament/view/" + id, "GET", undefined, (json) => {
      setTournamentDetail(json);
    });
  }

  async function fetchRounds(id: string) {
    fetch(`/s/rounds?tournament=${id}`, {
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
    if (Array.isArray(tournamentData) && tournamentData.length > 0) {
      fetchTournament(tournamentData[0].id);
      fetchRounds(tournamentData[0].id);
    }
  }, [tournamentData]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchJson("/s/profile/" + userId, "GET", undefined, (data) => {
      const games: Game[] = data.games;
      const gameData = games.map((g) => {
        return {
          id: g.id,
          name: g.white_name + " - " + g.black_name,
          start: TimestampString(g.start),
          tournament: g.tournament_name,
          timeControl: g.initial_time.toString() + "+" + g.increment.toString(),
          result: (function (r: number | undefined) {
            switch (r) {
              case 1:
                return "1-0";
              case 0:
                return "½-½";
              case -1:
                return "0-1";
              default:
                return "*";
            }
          })(g.outcome),
        };
      });
      setTournamentData(data.tournaments);
      setGameData(gameData);
    });
  }, [userId]);

  return (
    <>
      {tournamentDetail && (
        <>
          <div className="header">
            {Translated.byKey("recentTournament").toUpperCase()}:
          </div>
          <TournamentDetailProvider value={{ ...tournamentDetail, rounds }}>
            <div
              style={{
                color: "black",
                display: "flex",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              <Pairings showHeader={false} defaultMiniboards={true} />
            </div>
          </TournamentDetailProvider>
        </>
      )}
      <div className="header">
        {Translated.byKey("tournamentSchedule").toUpperCase()}:
      </div>

      <div className="box">
        {Array.isArray(gameData) && Array.isArray(tournamentData) && (
          <>
            <DataGrid
              autoHeight
              pageSize={pageSize}
              onPageSizeChange={(params: GridPageChangeParams) => {
                setPageSize(params.pageSize);
              }}
              rowsPerPageOptions={[15, 30, 50]}
              pagination
              rows={tournamentData}
              columns={tournamentColumns}
            />

            <DataGrid
              autoHeight
              pageSize={pageSize}
              onPageSizeChange={(params: GridPageChangeParams) => {
                setPageSize(params.pageSize);
              }}
              rowsPerPageOptions={[15, 30, 50]}
              pagination
              rows={gameData}
              columns={gameColumns}
            />
          </>
        )}
      </div>
    </>
  );
};

export { TournamentSchedule };
