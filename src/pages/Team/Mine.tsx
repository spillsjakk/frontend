import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { Team } from "../Tournament/Types";
import { UserContext } from "../../components/UserContext";
import UserLink from "../../components/UserLink";
import { RouteComponentProps, Link } from "react-router-dom";
import { fetchJson } from "../../functions";

type MineState = {
  teams: Team[]
}

class Mine extends Component<{}, MineState> {
  constructor(props: {}) {
    super(props);

    this.state = { teams: [] };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Team-View";

    fetchJson(`/s/team/mine`, "GET", undefined, result => this.setState(result));
  }

  render() {
    return (
      <>
        <Helmet>
          <title>My teams</title>
        </Helmet>
        <h1 className="mt-4 p-3"><Translated str="myTeams" /></h1>

        <table className="mt-4 table">
          {this.state.teams.map(team =>
            <tr>
              <td><Link to={"/team/view/" + team.id}>{team.name}</Link></td>
              <td><Link to={"/team/manage/" + team.id}><Translated str="manage" /></Link></td>
            </tr>
          )}
        </table>
      </>
    );
  }
}

export default Mine;