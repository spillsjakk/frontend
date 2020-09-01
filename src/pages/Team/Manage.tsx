import React, { Component, RefObject, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { Team, Account } from "../Tournament/Types";
import UserLink from "../../components/UserLink";
import { RouteComponentProps, Link } from "react-router-dom";
import { fetchJson } from "../../functions";
import { TeamMember } from "./Types";

type ManageProps = {
  tid: string
}

type ManageState = {
  loaded: boolean
  info?: {
    team: Team,
    members: TeamMember[]
    not_members: string[][]
  },
  newName: string,
  newDescription: string
};

class Manage extends Component<RouteComponentProps<ManageProps>, ManageState> {
  teamId: string;
  customAccRef: RefObject<HTMLInputElement>;

  constructor(props: RouteComponentProps<ManageProps>) {
    super(props);

    this.teamId = this.props.match.params.tid;
    this.state = { loaded: false, newName: "", newDescription: "" };
    this.customAccRef = React.createRef();

    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.loadState = this.loadState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
  }

  addMember(uid: string) {
    fetchJson(`/s/team/add-member/${this.teamId}/${uid}`, "POST", undefined, _ => {
      this.loadState();
    });
  }

  removeMember(uid: string) {
    fetchJson(`/s/team/remove-member/${this.teamId}/${uid}`, "POST", undefined, _ => {
      this.loadState();
    });
  }

  loadState() {
    fetchJson(`/s/team/manage/${this.props.match.params.tid}`, "GET", undefined, result => {
      this.setState({ loaded: true, info: result, newName: result.team.name, newDescription: result.team.description });
    });
  }

  handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitInfo(e: FormEvent) {
    e.preventDefault();

    fetchJson(`/s/team/edit/${this.teamId}`, "POST", { name: this.state.newName, description: this.state.newDescription }, _ => {
      const info = { ...this.state.info! };
      info.team.name = this.state.newName;
      info.team.description = this.state.newDescription;
      this.setState({ info });
    });
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Team-Manage";
    this.loadState();
  }

  render() {
    if (!this.state.loaded) {
      return <>Loading...</>;
    }

    const info = this.state.info!;
    return (
      <>
        <Helmet>
          <title>{info.team.name}</title>
        </Helmet>
        <h1 className="mt-4 p-3"><Translated str="manage" /> &quot;{info.team.name}&quot;</h1>

        <form className="mt-4" onSubmit={this.submitInfo}>
          <div className="form-group">
            <label htmlFor="newName"><Translated str="name" />:</label>&nbsp;
            <input type="text" className="form-control w-50" name="newName" id="newName" required value={this.state.newName} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="newDescription"><Translated str="description" />:</label>
            <textarea className="form-control w-50" name="newDescription" id="newDescription" required value={this.state.newDescription} onChange={this.handleChange} />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary" type="submit"><Translated str="update" /></button>
          </div>
        </form>

        <h3 className="mt-4"><Translated str="members" /></h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col"><Translated str="name" /></th>
              <th scope="col"><Translated str="remove" /></th>
            </tr>
          </thead>
          <tbody id="members">
            {info.members.map(player =>
              <tr>
                <td><UserLink id={player.account_id} name={player.first_name + " " + player.last_name} ghost={false} /></td>
                <td><a className="btn btn-danger" onClick={() => this.removeMember(player.account_id)}>X</a></td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="mt-4"><Translated str="otherClubMembers" /></h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col"><Translated str="name" /></th>
              <th scope="col"><Translated str="add" /></th>
            </tr>
          </thead>
          <tbody id="notMembers">
            {info.not_members.map(player =>
              <tr>
                <td><UserLink id={player[0]} name={player[1] + " " + player[2]} ghost={false} /></td>
                <td><a className="btn btn-primary" onClick={() => this.addMember(player[0])}>+</a></td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default Manage;