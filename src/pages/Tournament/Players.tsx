import React, { Component, FormEvent, ChangeEvent, RefObject } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/translated";
import { Tournament, Participant, Team, TeamParticipant, Account } from './Types';
import { RouteComponentProps, Link } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import './Players.css';
import FederationDropdown from "../../components/FederationDropdown";
import TitleDropdown from "../../components/TitleDropdown";
import SexDropdown from "../../components/SexDropdown";

type PlayersState = {
  loaded: boolean
  info?: {
    tournament: Tournament
    participants: Participant[]
    teams: TeamParticipant[],
    clubs: { name: string, id: string }[],
    accounts: Account[]
    managed_teams: Team[]
    is_team_tournament: boolean
  },
  newAcc: {
    first_name: string
    last_name: string
    fide_number: string
    title: string
    fide_rating: string
    fide_federation: string
    birth_date: string
    sex: string
  },
  newTeamId: string
  newClubId: string
}

type PlayersProps = {
  tid: string
}

class Players extends Component<RouteComponentProps<PlayersProps>, PlayersState> {
  tournamentId: string;

  accountRef: RefObject<HTMLInputElement>;
  teamRef: RefObject<HTMLSelectElement>;

  constructor(props: RouteComponentProps<PlayersProps>) {
    super(props);

    this.state = {
      loaded: false, newAcc: {
        first_name: "",
        last_name: "",
        fide_number: "",
        title: "",
        fide_rating: "",
        fide_federation: "NOR",
        birth_date: "",
        sex: "M"
      },
      newTeamId: "",
      newClubId: ""
    };
    this.tournamentId = this.props.match.params.tid;

    this.accountRef = React.createRef();
    this.teamRef = React.createRef();

    this.removeParticipant = this.removeParticipant.bind(this);
    this.removeTeam = this.removeTeam.bind(this);
    this.changeSeedingRadio = this.changeSeedingRadio.bind(this);
    this.updateSeeding = this.updateSeeding.bind(this);
    this.fideNumberBlur = this.fideNumberBlur.bind(this);
    this.changeNewAccValue = this.changeNewAccValue.bind(this);
    this.addNewAcc = this.addNewAcc.bind(this);
    this.addExistingAcc = this.addExistingAcc.bind(this);
    this.addTeam = this.addTeam.bind(this);
    this.loadState = this.loadState.bind(this);
    this.handleChangeClubOrTeam = this.handleChangeClubOrTeam.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-Players";

    this.loadState();
  }

  loadState() {
    fetchJson(`/s/tournament/players/${this.tournamentId}`, "GET", undefined, result => this.setState({ loaded: true, info: result }));
  }

  removeParticipant(uid: string) {
    fetchJson(`/s/tournament/remove-participant/${this.tournamentId}/${uid}`, "POST", undefined, _ => {
      const accounts = this.state.info!.accounts;
      accounts?.splice(accounts?.findIndex(a => a.id === uid), 1);
      const info = { ...this.state.info! };
      info.accounts = accounts;
      this.setState({ info });
    });
  }

  removeTeam(tid: string) {
    fetchJson(`/s/tournament/remove-team/${this.tournamentId}/${tid}`, "POST", undefined, _ => {
      const teams = this.state.info!.teams;
      teams?.splice(teams?.findIndex(t => t.team_id === tid), 1);
      const info = { ...this.state.info! };
      info.teams = teams;
      this.setState({ info });
    });
  }

  changeSeedingRadio(e: ChangeEvent<HTMLInputElement>) {
    const info = { ...this.state.info! };
    info.tournament.random_seeding = e.target.id === "randomSeeding" && e.target.checked;
    this.setState({ info });
  }

  updateSeeding() {
    fetchJson(
      `/s/tournament/change-seeding/${this.tournamentId}/${this.state.info?.tournament.random_seeding ? "random" : "rating"}`,
      "POST", undefined, _ => { }
    );
  }

  fideNumberBlur() {
    if (isNaN(parseInt(this.state.newAcc.fide_number as string, 10))) {
      return;
    }

    fetchJson(`/s/account/fide-autocomplete/${this.state.newAcc.fide_number}`, "GET", undefined, json => {
      const newAcc = { ...this.state.newAcc };
      newAcc.first_name = json.first_name || "";
      newAcc.last_name = json.last_name || "";
      newAcc.title = json.title || "";
      newAcc.fide_rating = json.rating || "";
      newAcc.fide_federation = json.federation || "";
      newAcc.birth_date = json.birth_year ? json.birth_year.toString() + "-01-01" : "";
      newAcc.sex = json.sex || "";
      this.setState({ newAcc });
    });
  }

  changeNewAccValue(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const newAcc = { ...this.state.newAcc };
    if (e.target.type === "number") {
      if (e.target.value === "" || !isNaN(parseInt(e.target.value, 10))) {
        (newAcc as any)[e.target.name] = e.target.value;
      }
    } else {
      (newAcc as any)[e.target.name] = e.target.value;
    }
    this.setState({ newAcc });
  }

  addNewAcc(e: FormEvent) {
    e.preventDefault();

    const data = {
      first_name: this.state.newAcc.first_name,
      last_name: this.state.newAcc.last_name,
      fide_number: parseInt(this.state.newAcc.fide_number, 10) || undefined,
      title: this.state.newAcc.title || undefined,
      fide_rating: parseInt(this.state.newAcc.fide_rating, 10) || undefined,
      fide_federation: this.state.newAcc.fide_federation || undefined,
      birth_date: this.state.newAcc.birth_date || undefined,
      sex: this.state.newAcc.sex || undefined,
      level: 0,
      ghost: true
    };
    fetchJson(`/s/account/create`, "POST", data, result => {
      this.setState({
        newAcc: {
          first_name: "",
          last_name: "",
          fide_number: "",
          title: "",
          fide_rating: "",
          fide_federation: "NOR",
          birth_date: "",
          sex: "M"
        }
      });
      this.addExistingAcc(result.id);
    });
  }

  addExistingAcc(uid: string) {
    fetchJson(`/s/tournament/add-participant/${this.tournamentId}/${uid}`, "POST", undefined, result => {
      const info = { ...this.state.info! };
      info.accounts.push(result);
      this.setState({ info });
    });
  }

  addTeam(team: string) {
    fetchJson(`/s/tournament/add-team/${this.tournamentId}/${team}`, "POST", undefined, result => {
      if (result.already) {
        return;
      }

      const info = { ...this.state.info! };
      info.teams.push({ team_id: result.id, name: result.name, game_score: 0, match_score: 0, eliminated: false, seed: 0 });
      this.setState({ info });
    })
  }

  handleChangeClubOrTeam(e: ChangeEvent<HTMLSelectElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  render() {
    if (!this.state.loaded) {
      return <>Loading...</>;
    }

    const info = this.state.info!;

    return (
      <>
        <Helmet>
          <title>{title("manageParticipants")}</title>
        </Helmet>
        <h1 className="mt-5 p-3"><Translated str="manageParticipants" /></h1>

        <div>
          <Link to={"/tournament/manage/" + info.tournament.id}><Translated str="backToTournament" /></Link>
        </div>

        <div className="mt-4">
          <Translated str="seeding" />: <input type="radio" name="seeding" id="ratingSeeding" checked={!info.tournament.random_seeding} onChange={this.changeSeedingRadio} />&nbsp;
          <label htmlFor="ratingSeeding"><Translated str="byRating" /></label>&nbsp;
          <input type="radio" name="seeding" id="randomSeeding" className="ml-4" checked={info.tournament.random_seeding} onChange={this.changeSeedingRadio} />&nbsp;
          <label htmlFor="randomSeeding"><Translated str="random" /></label>&nbsp;
          <button className="btn btn-primary p-3" id="seedingButton" onClick={this.updateSeeding}><Translated str="update" /></button>
        </div>

        <h3 className="mt-4"><Translated str="participants" /></h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col"><Translated str="firstName" /></th>
              <th scope="col"><Translated str="lastName" /></th>
              <th scope="col"><Translated str="fideNumber" /></th>
              <th scope="col"><Translated str="title" /></th>
              <th scope="col"><Translated str="fideRating" /></th>
              <th scope="col"><Translated str="fideFederation" /></th>
              <th scope="col"><Translated str="birthDate" /></th>
              <th scope="col"><Translated str="sex" /></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="accounts">
            {info.accounts.map(account =>
              <tr key={account.id}>
                <td>{account.first_name}</td>
                <td>{account.last_name}</td>
                <td>{account.fide_number}</td>
                <td>{account.title}</td>
                <td>{account.fide_rating}</td>
                <td>{account.fide_federation}</td>
                <td>{account.birth_date}</td>
                <td>{account.sex}</td>
                <td><a className="btn btn-danger" onClick={() => this.removeParticipant(account.id)}>X</a></td>
              </tr>)
            }
          </tbody>
        </table>

        <h3 className="mt-4"><Translated str="teams" /></h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col"><Translated str="name" /></th>
              <th scope="col"><Translated str="remove" /></th>
            </tr>
          </thead>
          <tbody id="teams">
            {info.teams.map(team =>
              <tr>
                <td>{team.name}</td>
                <td><a className="btn btn-danger" onClick={() => this.removeTeam(team.team_id)}>X</a></td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="mt-4"><Translated str="addATeam" /></h3>

        <div className="mt-4">
          {info.clubs.length > 0 && <>
            <select name="newClubId" value={this.state.newClubId} className="w-25" onChange={this.handleChangeClubOrTeam}>
              <option value=""></option>
              {info.clubs.map(club => <option value={club.id}>{club.name}</option>)}
            </select>
            &nbsp;&gt;&nbsp;
          </>}
          <select id="teamId" name="newTeamId" value={this.state.newTeamId} className="w-25" onChange={this.handleChangeClubOrTeam}>
            <option value=""></option>
            {info.managed_teams.filter(t => info.clubs.length === 0 || t.club === this.state.newClubId).map(managed_team =>
              <option value={managed_team.id}>{managed_team.name}</option>
            )}
          </select>&nbsp;

          <a className="btn btn-primary" onClick={() => this.addTeam(this.state.newTeamId)}>+</a>
        </div>

        {!info.is_team_tournament &&
          <>
            <h3 className="mt-4"><Translated str="addParticipantsWithoutAccount" /></h3>

            <form onSubmit={this.addNewAcc}>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"><Translated str="firstName" /></th>
                    <th scope="col"><Translated str="lastName" /></th>
                    <th scope="col"><Translated str="fideNumber" /></th>
                    <th scope="col"><Translated str="title" /></th>
                    <th scope="col"><Translated str="fideRating" /></th>
                    <th scope="col"><Translated str="fideFederation" /></th>
                    <th scope="col"><Translated str="birthDate" /></th>
                    <th scope="col"><Translated str="sex" /></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" id="firstNameInput" name="first_name" value={this.state.newAcc.first_name} onChange={this.changeNewAccValue} required /></td>
                    <td><input type="text" id="lastNameInput" name="last_name" value={this.state.newAcc.last_name} onChange={this.changeNewAccValue} required /></td>
                    <td><input type="number" id="fideNumberInput" name="fide_number" value={this.state.newAcc.fide_number} onChange={this.changeNewAccValue} onBlur={this.fideNumberBlur} /></td>
                    <td><TitleDropdown id="titleInput" name="title" value={this.state.newAcc.title} onChange={this.changeNewAccValue} /></td>
                    <td><input type="number" id="fideRatingInput" name="fide_rating" value={this.state.newAcc.fide_rating} onChange={this.changeNewAccValue} /></td>
                    <td><FederationDropdown id="fideFederationInput" name="fide_federation" value={this.state.newAcc.fide_federation} onChange={this.changeNewAccValue} /></td>
                    <td><input type="date" id="birthDateInput" name="birth_date" value={this.state.newAcc.birth_date} onChange={this.changeNewAccValue} required /></td>
                    <td><SexDropdown id="sexInput" name="sex" value={this.state.newAcc.sex} onChange={this.changeNewAccValue} /></td>
                    <td><button type="submit" className="btn btn-primary" id="addButton">+</button></td>
                  </tr>
                </tbody>
              </table>
            </form>
          </>}
      </>
    );
  }
}

export default Players;