import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { Tournament } from "./Types";
import { Link, RouteComponentProps } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import UserLink from "../../components/UserLink";
import "./TeamPlayers.css";
import AddIcon from "@material-ui/icons/Add";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Dehaze, Delete } from "@material-ui/icons";

type TeamPlayersProps = {
  tournamentId: string;
  teamId: string;
};

type TeamPlayersState = {
  loaded: boolean;
  isWithinFiveMins: boolean;
  info?: {
    tournament: Tournament;
    participating: string[];
    not_participating: string[];
    team_id: string;
  };
};

const DragHandle = SortableHandle(() => <Dehaze className="dehaze" />);

const SortableItem = SortableElement(
  ({ value, id, remove, playerIndex, hideHandle }) => (
    <ListItem>
      <span className="playerIndex">{playerIndex}</span>
      <ListItemIcon>{!hideHandle && <DragHandle />}</ListItemIcon>
      <ListItemText>
        <UserLink id={id} name={value} ghost={false} />
      </ListItemText>
      <IconButton edge="end" aria-label="delete" onClick={() => remove(id)}>
        <Delete />
      </IconButton>
    </ListItem>
  )
);

const AddListItem = ({ value, id, add }) => (
  <ListItem>
    <ListItemText>
      <UserLink id={id} name={value} ghost={false} />
    </ListItemText>
    <IconButton edge="end" onClick={() => add(id)}>
      <AddIcon color="action" />
    </IconButton>
  </ListItem>
);

const SortableList = SortableContainer(({ children }) => {
  return <List>{children}</List>;
});

function isWithinFiveMinutes(currentOnlinePairingTime: string): boolean {
  const pairingTime = new Date(currentOnlinePairingTime);

  const now = new Date();

  const diff = pairingTime.getTime() - now.getTime();

  // Check if the difference is less than 5 minutes (5 * 60 * 1000 milliseconds)
  return diff > 0 && diff <= 5 * 60 * 1000;
}

class TeamPlayers extends Component<
  RouteComponentProps<TeamPlayersProps>,
  TeamPlayersState
> {
  tournamentId: string;
  teamId: string;
  intervalId: any;

  constructor(props: RouteComponentProps<TeamPlayersProps>) {
    super(props);

    this.state = { loaded: false, isWithinFiveMins: false };
    this.tournamentId = this.props.match.params.tournamentId;
    this.teamId = this.props.match.params.teamId;

    this.addParticipant = this.addParticipant.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.changeSeed = this.changeSeed.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
    this.intervalId = null;
  }

  checkTime = (info?: any) => {
    const pairingTime = new Date(
      info?.tournament?.current_online_pairing_time ||
        this.state.info?.tournament?.current_online_pairing_time
    );
    const now = new Date();
    const diff = pairingTime.getTime() - now.getTime();
    this.setState({
      isWithinFiveMins: diff > 0 && diff <= 5 * 60 * 1000,
    });
  };

  fetchInfo() {
    fetchJson(
      `/s/tournament/manage-team/${this.tournamentId}/${this.teamId}`,
      "GET",
      undefined,
      (result) => {
        this.setState({ loaded: true, info: result });
        this.checkTime(result);
      }
    );
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-TeamPlayers";
    this.fetchInfo();
    this.intervalId = setInterval(this.checkTime, 10 * 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
        this.fetchInfo();
      }
    );
  }

  removeParticipant(uid: string) {
    fetchJson(
      `/s/tournament/remove-participant/${this.tournamentId}/${uid}?team=${this.teamId}`,
      "POST",
      undefined,
      (_) => {
        this.fetchInfo();
      }
    );
  }

  changeSeed(participantId, seed) {
    fetchJson(
      `/s/tournament/${this.tournamentId}/team/${this.teamId}/participant/${participantId}/seed/${seed}`,
      "PUT",
      undefined,
      () => {
        this.fetchInfo();
      }
    );
  }

  onSortEnd(event) {
    const participantSeed = event.oldIndex + 1;
    const seed = event.newIndex + 1;
    const participant = this.state.info!.participating.find(
      (p) => p[3] === participantSeed
    );
    if (participant) {
      this.changeSeed(participant[0], seed);
    }
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
          <Link to={"/tournament/view/" + info.tournament.id}>
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
        <SortableList onSortEnd={this.onSortEnd} useDragHandle>
          {info.participating.map((player, index) => (
            <SortableItem
              key={`item-${player[0]}${index}`}
              playerIndex={index + 1}
              id={player[0]}
              value={player[1] + " " + player[2]}
              remove={this.removeParticipant}
              index={index}
              hideHandle={
                this.state.info?.tournament?.kind === "LimitedPlayerTeam" &&
                this.state.isWithinFiveMins
              }
            />
          ))}
        </SortableList>

        <h3 className="mt-4">
          <Translated str="notParticipating" />
        </h3>

        {info.not_participating.map((player, index) => (
          <AddListItem
            key={`item-${player[0]}${index}`}
            id={player[0]}
            value={player[1] + " " + player[2]}
            add={this.addParticipant}
          />
        ))}
      </>
    );
  }
}

export default TeamPlayers;
