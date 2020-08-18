import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../components/Translated";
import { fetchJson } from "../functions";
import { RouteComponentProps, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search, SearchMatchProps } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;

type ProfileState = {
  name: string,
  tournamentData: Tournament[],
  tournamentColumns: any[],
  gameData: any[],
  gameColumns: any[]
}

type Tournament = {
  id: string,
  name: string,
  start_date: string,
  end_date: string
}

type Game = {
  id: string,
  white_name: string,
  black_name: string,
  start: string,
  tournament_name: string,
  initial_time: number,
  increment: number,
  outcome: number
}

type ProfileParams = {
  uid: string
}

class Profile extends Component<RouteComponentProps<ProfileParams>, ProfileState> {
  constructor(props: RouteComponentProps<ProfileParams>) {
    super(props);
    this.state = {
      name: "", tournamentData: [], tournamentColumns: [
        {
          dataField: "tournament", text: Translated.byKey("tournament"), formatter: function (_: any, row: Tournament, __: any, ___: any) {
            return <Link to={"/tournament/view/" + row.id}>{row.name}</Link>
          }
        },
        { dataField: "start_date", text: Translated.byKey("startDate"), sort: true },
        { dataField: "end_date", text: Translated.byKey("endDate"), sort: true }
      ],
      gameData: [], gameColumns: [
        {
          dataField: "game", text: Translated.byKey("game"), formatter: function (_: any, row: Tournament, __: any, ___: any) {
            return <Link to={"/game/view/" + row.id}>{row.name}</Link>
          }
        },
        { dataField: "start", text: Translated.byKey("dateTime"), sort: true },
        { dataField: "tournament", text: Translated.byKey("tournament"), sort: true },
        { dataField: "timeControl", text: Translated.byKey("timeControl"), sort: true },
        { dataField: "result", text: Translated.byKey("result"), sort: true }
      ]
    };
  }

  onColumnMatch({
    searchText,
    value,
    column,
    row
  }: SearchMatchProps<any>) {
    return (value && value.toLowerCase().includes(searchText)) ||
      (row.id.toLowerCase().includes(searchText) || row.name.toLowerCase().includes(searchText));
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Profile";

    fetchJson("/s/profile/" + this.props.match.params.uid, "GET", undefined, data => {
      const tournamentData = data.tournaments;

      const games: Game[] = data.games;
      const gameData = games.map(g => {
        return {
          id: g.id,
          name: g.white_name + " - " + g.black_name,
          start: g.start.replace("T", " ").replace("Z", "").split(".")[0],
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
          })(g.outcome)
        };
      }
      );
      this.setState({ name: data.name, tournamentData, gameData });
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Profile</title>
        </Helmet>

        <h1 className="mt-4 p-3">
          {this.state.name}
        </h1>

        <div className="mt-5"></div>

        <ToolkitProvider
          keyField="id"
          data={this.state.tournamentData}
          columns={this.state.tournamentColumns}
          bootstrap4={true}
          search={{ onColumnMatch: this.onColumnMatch }}
        >
          {props =>
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable {...props.baseProps} pagination={paginationFactory({})} />
            </>
          }
        </ToolkitProvider>

        <div className="mt-5"></div>

        <ToolkitProvider
          keyField="id"
          data={this.state.gameData}
          columns={this.state.gameColumns}
          bootstrap4={true}
          search={{ onColumnMatch: this.onColumnMatch }}
        >
          {props =>
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable {...props.baseProps} pagination={paginationFactory({})} />
            </>
          }
        </ToolkitProvider>
      </>
    );
  }
}

export default Profile;