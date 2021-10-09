import React, { Component, RefObject, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { Team } from "../Tournament/Types";
import UserLink from "../../components/UserLink";
import { RouteComponentProps } from "react-router-dom";
import { fetchJson } from "../../functions";
import { TeamMember } from "./Types";
import { Form } from "react-bootstrap";
import "./Manage.css";

type ManageProps = {
  tid: string;
};

type ManageState = {
  loaded: boolean;
  info?: {
    team: Team;
    members: TeamMember[];
    not_members: string[][];
  };
  newName: string;
  newDescription: string;
  message: string;
  profilePicture: string;
};

class Manage extends Component<RouteComponentProps<ManageProps>, ManageState> {
  teamId: string;
  customAccRef: RefObject<HTMLInputElement>;

  constructor(props: RouteComponentProps<ManageProps>) {
    super(props);

    this.teamId = this.props.match.params.tid;
    this.state = {
      loaded: false,
      newName: "",
      newDescription: "",
      message: "",
      profilePicture: "",
    };
    this.customAccRef = React.createRef();

    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.loadState = this.loadState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
    this.messageMembers = this.messageMembers.bind(this);
  }

  addMember(uid: string) {
    fetchJson(
      `/s/team/add-member/${this.teamId}/${uid}`,
      "POST",
      undefined,
      (_) => {
        this.loadState();
      }
    );
  }

  removeMember(uid: string) {
    fetchJson(
      `/s/team/remove-member/${this.teamId}/${uid}`,
      "POST",
      undefined,
      (_) => {
        this.loadState();
      }
    );
  }

  messageMembers(e: any) {
    e.preventDefault();

    fetchJson(
      `/s/team/message-members/${this.teamId}`,
      "POST",
      { text: this.state.message },
      (_) => {
        this.setState({ message: "" });
      }
    );
  }

  loadState() {
    fetchJson(
      `/s/team/manage/${this.props.match.params.tid}`,
      "GET",
      undefined,
      (result) => {
        this.setState({
          loaded: true,
          info: result,
          newName: result.team.name,
          newDescription: result.team.description,
          profilePicture: result.team.profile_picture,
        });
      }
    );
  }

  handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitInfo(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/team/edit/${this.teamId}`,
      "POST",
      {
        name: this.state.newName,
        description: this.state.newDescription ? this.state.newDescription : "",
        profile_picture: this.state.profilePicture ? this.state.profilePicture : "",
      },
      (_) => {
        const info = { ...this.state.info! };
        info.team.name = this.state.newName;
        info.team.description = this.state.newDescription;
        info.team.profile_picture = this.state.profilePicture;
        this.setState({ info });
      }
    );
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
        <h1 className="mt-4 p-3">
          <Translated str="manage" /> &quot;{info.team.name}&quot;
        </h1>

        <form className="mt-4" onSubmit={this.submitInfo}>
          <div className="form-group">
            <label htmlFor="newName">
              <Translated str="name" />:
            </label>
            &nbsp;
            <input
              type="text"
              className="form-control w-50"
              name="newName"
              id="newName"
              required
              pattern="^[a-zA-Z0-9-_\sÅåÆæØø]+$"
              value={this.state.newName}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profilepicture">
              <Translated str="profile_picture" />:
            </label>
            &nbsp;
            <input
              type="text"
              className="form-control w-50"
              name="profilePicture"
              id="profilepicture"
              value={this.state.profilePicture}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="newDescription">
              <Translated str="description" />:
            </label>
            <textarea
              className="form-control w-50"
              name="newDescription"
              id="newDescription"
              value={this.state.newDescription}
              onChange={this.handleChange}
            />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary" type="submit">
              <Translated str="update" />
            </button>
          </div>
        </form>

        <h3 className="mt-4">
          <Translated str="members" />
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
          <tbody id="members">
            {info.members.map((player, i) => (
              <tr key={i}>
                <td>
                  <UserLink
                    id={player.account_id}
                    name={player.first_name + " " + player.last_name}
                    ghost={false}
                  />
                </td>
                <td>
                  <a
                    className="btn btn-danger"
                    onClick={() => this.removeMember(player.account_id)}
                  >
                    X
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-4">
          <Translated str="otherClubMembers" />
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
          <tbody id="notMembers">
            {info.not_members.map((player, i) => (
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
                    onClick={() => this.addMember(player[0])}
                  >
                    +
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-4">
          <Translated str="messageJustToTeamMembers" />
        </h3>
        <Form onSubmit={this.messageMembers}>
          <Form.Group>
            <textarea
              required
              className="form-control w-50"
              onChange={(e) => {
                this.setState({ message: e.target.value });
              }}
              value={this.state.message}
            />
          </Form.Group>
          <button className="btn btn-primary" type="submit">
            {Translated.byKey("send")}
          </button>
        </Form>
      </>
    );
  }
}

export default Manage;
