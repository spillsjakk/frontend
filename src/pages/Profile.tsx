import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../components/Translated";
import { fetchJson } from "../functions";
import { RouteComponentProps, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

type ProfileState = {
  name: string,
  tournamentData: any[],
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
        { dataField: "tournament", text: Translated.byKey("tournament") },
        { dataField: "startDate", text: Translated.byKey("startDate"), sort: true },
        { dataField: "endDate", text: Translated.byKey("endDate"), sort: true }
      ],
      gameData: [], gameColumns: [
        { dataField: "game", text: Translated.byKey("game") },
        { dataField: "start", text: Translated.byKey("dateTime"), sort: true },
        { dataField: "tournament", text: Translated.byKey("tournament"), sort: true },
        { dataField: "timeControl", text: Translated.byKey("timeControl"), sort: true },
        { dataField: "result", text: Translated.byKey("result"), sort: true }
      ]
    };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Profile";

    fetchJson("/s/profile/" + this.props.match.params.uid, "GET", undefined, data => {
      const tournaments: Tournament[] = data.tournaments;
      const tournamentData = tournaments.map(t => {
        let elem = <Link to={"/tournament/view/" + t.id}>{t.name}</Link>;
        return {
          id: t.id,
          tournament: elem,
          startDate: t.start_date,
          endDate: t.end_date
        };
      });

      const games: Game[] = data.games;
      const gameData = games.map(g => {
        let elem = <Link to={"/game/view" + g.id}>{g.white_name} - {g.black_name}</Link>;
        return {
          id: g.id,
          game: elem,
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
        <BootstrapTable
          keyField="id"
          data={this.state.tournamentData}
          columns={this.state.tournamentColumns}
          bootstrap4={true}
          pagination={ paginationFactory({}) } />
        <div className="mt-5"></div>
        <BootstrapTable
          keyField="id"
          data={this.state.gameData}
          columns={this.state.gameColumns}
          bootstrap4={true}
          pagination={ paginationFactory({}) } />
      </>
    );
  }
}

export default Profile;