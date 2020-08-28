import React, { Component, RefObject } from "react";
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
  }
};

class Manage extends Component<RouteComponentProps<ManageProps>, ManageState> {
  teamId: string;
  customAccRef: RefObject<HTMLInputElement>;

  constructor(props: RouteComponentProps<ManageProps>) {
    super(props);

    this.teamId = this.props.match.params.tid;
    this.state = { loaded: false };
    this.customAccRef = React.createRef();

    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.loadState = this.loadState.bind(this);
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
    fetchJson(`/s/team/manage/${this.props.match.params.tid}`, "GET", undefined, result => this.setState({ loaded: true, info: result }));
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Team-View";
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

        <h3 className="mt-4"><Translated str="addOtherAccount" /></h3>

        <p><strong><Translated str="id" />:</strong></p>

        <div className="mb-5">
          <input type="text" className="form-control w-25 d-inline" ref={this.customAccRef} />
          <a className="btn btn-primary" onClick={() => { this.addMember(this.customAccRef.current?.value || ""); this.customAccRef.current!.value = ""; }}>+</a>
        </div>
      </>
    );
  }
}

export default Manage;