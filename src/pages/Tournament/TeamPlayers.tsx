import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/Translated";
import { Tournament } from "./Types";
import { Link, RouteComponentProps } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import UserLink from "../../components/UserLink";

type TeamPlayersProps = {
  tournamentId: string;
  teamId: string;
};

type TeamPlayersState = {
  loaded: boolean;
  info?: {
    tournament: Tournament;
    participating: string[];
    not_participating: string[];
    team_id: string;
  };
};

class TeamPlayers extends Component<
  RouteComponentProps<TeamPlayersProps>,
  TeamPlayersState
> {
  tournamentId: string;
  teamId: string;

  constructor(props: RouteComponentProps<TeamPlayersProps>) {
    super(props);

    this.state = { loaded: false };
    this.tournamentId = this.props.match.params.tournamentId;
    this.teamId = this.props.match.params.teamId;

    this.addParticipant = this.addParticipant.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-TeamPlayers";

    fetchJson(
      `/s/tournament/manage-team/${this.tournamentId}/${this.teamId}`,
      "GET",
      undefined,
      (result) => {
        this.setState({ loaded: true, info: result });
      }
    );
  }

  addParticipant(uid: string) {
    const info = this.state.info!;
    if (
      info.tournament.per_team_limit &&
      info.participating.length >= info.tournament.per_team_limit
    ) {
      return;
    }

    fetchJson(
      `/s/tournament/add-participant/${this.tournamentId}/${uid}?team=${this.teamId}`,
      "POST",
      undefined,
      (_) => {
        const participantIndex = info.not_participating.findIndex(
          (p) => p[0] === uid
        );
        info.participating.push(info.not_participating[participantIndex]);
        info.not_participating.splice(participantIndex, 1);
        this.setState({ info });
      }
    );
  }

  removeParticipant(uid: string) {
    fetchJson(
      `/s/tournament/remove-participant/${this.tournamentId}/${uid}?team=${this.teamId}`,
      "POST",
      undefined,
      (_) => {
        const info = this.state.info!;
        const participantIndex = info.participating.findIndex(
          (p) => p[0] === uid
        );
        info.not_participating.push(info.participating[participantIndex]);
        info.participating.splice(participantIndex, 1);
        this.setState({ info });
      }
    );
  }

  render() {
    if (!this.state.loaded) {
      return <>Loading...</>;
    }

    const info = this.state.info!;
    return (
      <>
        <Helmet>
          <title>{title("manageTeamPlayers")}</title>
        </Helmet>

        <h1 className="mt-4 p-3">
          <Translated str="manageTeamPlayers" />
        </h1>

        <p className="mt-2">
          <Link to={"/tournament/manage/" + info.tournament.id}>
            <Translated str="backToTournament" />
          </Link>
        </p>

        {info.tournament.per_team_limit && (
          <p className="mt-2">
            <strong>
              {info.tournament.per_team_limit}{" "}
              <Translated str="playersPerTeam" />
            </strong>
          </p>
        )}

        <h3 className="mt-4">
          <Translated str="participating" />
        </h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <Translated str="name" />
              </th>
              <th scope="col">
                <Translated str="remove" />
              </th>
            </tr>
          </thead>
          <tbody id="participating">
            {info.participating.map((player, i) => (
              <tr key={i}>
                <td>
                  <UserLink
                    id={player[0]}
                    name={player[1] + " " + player[2]}
                    ghost={false}
                  />
                </td>
                <td>
                  <a
                    className="btn btn-danger"
                    onClick={() => this.removeParticipant(player[0])}
                  >
                    X
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-4">
          <Translated str="notParticipating" />
        </h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <Translated str="name" />
              </th>
              <th scope="col">
                <Translated str="add" />
              </th>
            </tr>
          </thead>
          <tbody id="notParticipating">
            {info.not_participating.map((player, i) => (
              <tr key={i}>
                <td>
                  <UserLink
                    id={player[0]}
                    name={player[1] + " " + player[2]}
                    ghost={false}
                  />
                </td>
                <td>
                  <a
                    className="btn btn-primary"
                    onClick={() => this.addParticipant(player[0])}
                  >
                    +
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default TeamPlayers;
