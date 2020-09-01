import React, { Component, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { Tournament } from "./Types";
import { Link } from "react-router-dom";
import { fetchJson, title } from "../../functions";

type FindState = {
  ongoing: Tournament[],
  upcoming: Tournament[]
}

class Find extends Component<{}, FindState> {
  constructor(props: {}) {
    super(props);

    this.state = { ongoing: [], upcoming: [] };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-Find";

    fetchJson(`/s/tournament/find`, "GET", undefined, result => this.setState(result));
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("findTournaments")}</title>
        </Helmet>
        <h1 className="mt-4 p-3"><Translated str="findTournaments" /></h1>

        <h3 className="mt-4"><Translated str="ongoingTournaments" /></h3>

        <table className="mt-3 table">
          {this.state.ongoing.map(tournament =>
            <tr>
              <td><Link to={"/tournament/view/" + tournament.id}>{tournament.name}</Link></td>
              <td>{tournament.start_date}</td>
              <td>{tournament.end_date}</td>
            </tr>
          )}
        </table>

        <h3 className="mt-4"><Translated str="upcomingTournaments" /></h3>

        <table className="mt-3 table">
          {this.state.upcoming.map(tournament =>
            <tr>
              <td><Link to={"/tournament/view/" + tournament.id}>{tournament.name}</Link></td>
              <td>{tournament.start_date}</td>
              <td>{tournament.end_date}</td>
            </tr>
          )}
        </table>
      </>
    );
  }
}

export default Find;