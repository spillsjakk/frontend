/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useState } from "react";
import ToolkitProvider, {
  Search,
  SearchMatchProps,
} from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import { TimestampString } from "../../components/Timestamp";
import Translated from "../../components/translated";
import { fetchJson } from "../../functions";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";

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
  const [tournamentData, setTournamentData] = useState<any>();
  const [tournamentColumns] = useState([
    {
      dataField: "tournament",
      text: Translated.byKey("tournament"),
      formatter: function (_: any, row: Tournament, __: any, ___: any) {
        return <Link to={"/tournament/view/" + row.id}>{row.name}</Link>;
      },
    },
    {
      dataField: "start_date",
      text: Translated.byKey("startDate"),
      sort: true,
    },
    {
      dataField: "end_date",
      text: Translated.byKey("endDate"),
      sort: true,
    },
  ]);
  const [gameData, setGameData] = useState<any>();
  const [gameColumns] = useState([
    {
      dataField: "game",
      text: Translated.byKey("game"),
      formatter: function (_: any, row: Tournament, __: any, ___: any) {
        return <Link to={"/game/view/" + row.id}>{row.name}</Link>;
      },
    },
    { dataField: "start", text: Translated.byKey("dateTime"), sort: true },
    {
      dataField: "tournament",
      text: Translated.byKey("tournament"),
      sort: true,
    },
    {
      dataField: "timeControl",
      text: Translated.byKey("timeControl"),
      sort: true,
    },
    { dataField: "result", text: Translated.byKey("result"), sort: true },
  ]);

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

  function onColumnMatch({
    searchText,
    value,
    column,
    row,
  }: SearchMatchProps<any>) {
    return (
      (value && value.toLowerCase().includes(searchText)) ||
      row.id.toLowerCase().includes(searchText) ||
      row.name.toLowerCase().includes(searchText)
    );
  }

  return (
    <>
      <div className="header">
        {Translated.byKey("tournamentSchedule").toUpperCase()}:
      </div>

      <div className="box">
        {Array.isArray(gameData) && Array.isArray(tournamentData) && (
          <>
            <ToolkitProvider
              keyField="id"
              data={tournamentData}
              columns={tournamentColumns}
              bootstrap4={true}
              search={{ onColumnMatch: onColumnMatch }}
            >
              {(props) => (
                <>
                  <Search.SearchBar {...props.searchProps} />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory({})}
                  />
                </>
              )}
            </ToolkitProvider>

            <ToolkitProvider
              keyField="id"
              data={gameData}
              columns={gameColumns}
              bootstrap4={true}
              search={{ onColumnMatch: onColumnMatch }}
            >
              {(props) => (
                <>
                  <Search.SearchBar {...props.searchProps} />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory({})}
                  />
                </>
              )}
            </ToolkitProvider>
          </>
        )}
      </div>
    </>
  );
};

export { TournamentSchedule };
