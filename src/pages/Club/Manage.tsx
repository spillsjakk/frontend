import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/Translated";
import { fetchJson, title } from "../../functions";
import UserLink from "../../components/UserLink";
import { Link } from "react-router-dom";
import FederationDropdown from "../../components/FederationDropdown";

type ManageState = {
  exists: boolean;
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  country: string;
  region: string;
  members: any[];
  newMemberId: string;
  teams: any[];
  newTeamName: string;
  newOrgId: string;
  orgs: any[];
  suggestedOrgs: any[];
  newOrgId2: string;
};

class Manage extends PureComponent<{}, ManageState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      exists: false,
      id: "",
      name: "",
      description: "",
      profile_picture: "",
      country: "NOR",
      region: "",
      members: [],
      newMemberId: "",
      teams: [],
      newTeamName: "",
      newOrgId: "",
      orgs: [],
      suggestedOrgs: [],
      newOrgId2: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.addMember = this.addMember.bind(this);
    this.loadMembers = this.loadMembers.bind(this);
    this.addTeam = this.addTeam.bind(this);
    this.leaveOrg = this.leaveOrg.bind(this);
    this.joinOrg = this.joinOrg.bind(this);
    this.joinOrg2 = this.joinOrg2.bind(this);
    this.loadState = this.loadState.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Club-Manage";

    this.loadState();
  }

  loadState() {
    fetchJson("/s/club/manage", "GET", undefined, (result) => {
      if (result.length > 0) {
        this.setState(
          {
            id: result[0].id,
            name: result[0].name,
            description: result[0].description,
            profile_picture: result[0].profile_picture,
            country: result[0].country,
            region: result[0].region,
            exists: true,
          },
          () => {
            fetchJson(
              `/s/club/teams/${this.state.id}`,
              "GET",
              undefined,
              (teams) => {
                this.setState({ teams }, () => {
                  this.loadMembers();
                  this.loadOrgs();
                  this.loadSuggestedOrgs();
                });
              }
            );
          }
        );
      }
    });
  }

  loadMembers() {
    fetchJson(
      `/s/club/members/${this.state.id}`,
      "GET",
      undefined,
      (members) => {
        this.setState({ members });
      }
    );
  }

  handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const newState: any = {};
    if (e.target.name !== "id") {
      newState[e.target.name] = e.target.value;
    } else {
      newState[e.target.name] = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "");
    }
    this.setState(newState);
  }

  submit(e: FormEvent) {
    e.preventDefault();

    fetchJson(`/s/club/edit`, "POST", this.state, this.loadState);
  }

  removeMember(uid: string) {
    fetchJson(
      `/s/club/remove-member/${this.state.id}/${uid}`,
      "POST",
      undefined,
      (_) => {
        const members = [...this.state.members];
        members.splice(
          members.findIndex((m) => m.account_id === uid),
          1
        );
        this.setState({ members });
      }
    );
  }

  addMember(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/club/add-member/${this.state.id}/${this.state.newMemberId}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ newMemberId: "" }, this.loadMembers);
      }
    );
  }

  addTeam(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/club/add-team/${this.state.id}`,
      "POST",
      { name: this.state.newTeamName },
      (team) => {
        this.setState({
          teams: this.state.teams.concat([{ id: team.id, name: team.name }]),
        });
      }
    );
  }

  leaveOrg(oid: string) {
    fetchJson(
      `/s/organization/remove-club/${oid}/${this.state.id}`,
      "POST",
      undefined,
      (_) => {
        const orgs = [...this.state.orgs];
        orgs.splice(
          orgs.findIndex((o) => o.id === oid),
          1
        );
        this.setState({ orgs });
      }
    );
  }

  joinOrg(e: FormEvent) {
    e.preventDefault();

    if (this.state.newOrgId === "") return;

    fetchJson(
      `/s/organization/add-club/${this.state.newOrgId}/${this.state.id}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ newOrgId: "" }, this.loadOrgs);
      }
    );
  }

  joinOrg2(e: FormEvent) {
    e.preventDefault();

    if (this.state.newOrgId2 === "") return;

    fetchJson(
      `/s/organization/add-club/${this.state.newOrgId2}/${this.state.id}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ newOrgId2: "" }, this.loadOrgs);
      }
    );
  }

  loadOrgs() {
    fetchJson(
      `/s/club/organizations/${this.state.id}`,
      "GET",
      undefined,
      (orgs) => {
        this.setState({ orgs });
      }
    );
  }

  loadSuggestedOrgs() {
    fetchJson(
      `/s/club/suggested-orgs/${this.state.id}`,
      "GET",
      undefined,
      (suggestedOrgs) => {
        this.setState({ suggestedOrgs });
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("manageClub")}</title>
        </Helmet>
        <h1 className="mt-5 p-3">
          <Translated str="manageClub" />
        </h1>
        <form className="mt-5" onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="description">
              <Translated str="name" />:
            </label>
            <input
              type="text"
              className="form-control w-50"
              id="name"
              name="name"
              required
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="id">
              <Translated str="id" />:
            </label>
            <input
              type="text"
              id="id"
              className="form-control w-50"
              name="id"
              required
              value={this.state.id}
              disabled={this.state.exists}
              onChange={this.handleChange}
              pattern="[a-z0-9_-]+"
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="description">
              <Translated str="description" />:
            </label>
            <textarea
              id="description"
              className="form-control w-50"
              name="description"
              required
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="profile_picture">
              <Translated str="profile_picture" />:
            </label>
            <input
              id="profile_picture"
              className="form-control w-50"
              name="profile_picture"
              required
              value={this.state.profile_picture}
              onChange={this.handleChange}
              placeholder={Translated.byKey("profilePicturePlaceholder")}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="country">
              <Translated str="country" />:
            </label>
            <FederationDropdown
              value={this.state.country}
              name="country"
              id="country"
              className="form-control w-25"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="region">
              <Translated str="region" />:
            </label>
            {this.state.country !== "NOR" ? (
              <input
                type="text"
                id="region"
                className="form-control w-25"
                name="region"
                required
                value={this.state.region}
                onChange={this.handleChange}
              />
            ) : (
              <select
                id="region"
                className="form-control w-25"
                required
                name="region"
                value={this.state.region}
                onChange={this.handleChange}
              >
                <option value=""></option>
                <option value="Oslo">Oslo</option>
                <option value="Rogaland">Rogaland</option>
                <option value="Møre og Romsdal">Møre og Romsdal</option>
                <option value="Nordland">Nordland</option>
                <option value="Viken">Viken</option>
                <option value="Innlandet">Innlandet</option>
                <option value="Vestfold og Telemark">
                  Vestfold og Telemark
                </option>
                <option value="Agder">Agder</option>
                <option value="Vestland">Vestland</option>
                <option value="Trøndelag">Trøndelag</option>
                <option value="Troms og Finnmark">Troms og Finnmark</option>
              </select>
            )}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              <Translated str="submit" />
            </button>
          </div>
        </form>

        <h3 className="mt-5">
          <Translated str="joinOrganization" />
        </h3>
        <form className="mt-4" onSubmit={this.joinOrg}>
          <div className="form-group">
            <label htmlFor="newOrgId">
              <Translated str="id" />:
            </label>
            &nbsp;
            <input
              type="text"
              id="newOrgId"
              name="newOrgId"
              required
              value={this.state.newOrgId}
              onChange={this.handleChange}
            />
            &nbsp;
            <button className="btn btn-primary" type="submit">
              +
            </button>
          </div>
        </form>

        <form className="mt-4" onSubmit={this.joinOrg2}>
          <strong>
            <Translated str="suggestedOrganizations" />:
          </strong>
          &nbsp;
          <select
            name="newOrgId2"
            value={this.state.newOrgId2}
            onChange={this.handleChange}
          >
            <option value=""></option>
            {this.state.suggestedOrgs
              .filter((so) => !this.state.orgs.find((o) => o.id == so.id))
              .map((so) => (
                <option key={so.id} value={so.id}>
                  {so.name}
                </option>
              ))}
          </select>
          &nbsp;
          <button className="btn btn-primary" type="submit">
            +
          </button>
        </form>

        <h3 className="mt-5">
          <Translated str="organizations" />
        </h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.orgs.map((org) => (
              <tr key={org.id}>
                <td>
                  <Link to={"/organization/view/" + org.id}>{org.name}</Link>
                </td>
                <td>
                  <a
                    className="btn btn-danger"
                    onClick={() => this.leaveOrg(org.id)}
                  >
                    X
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-5">
          <Translated str="createATeam" />
        </h3>
        <form className="mt-4" onSubmit={this.addTeam}>
          <div className="form-group">
            <label htmlFor="newTeamName">
              <Translated str="name" />:
            </label>
            &nbsp;
            <input
              type="text"
              id="newTeamName"
              name="newTeamName"
              required
              value={this.state.newTeamName}
              onChange={this.handleChange}
            />
            &nbsp;
            <button className="btn btn-primary" type="submit">
              +
            </button>
          </div>
        </form>

        <h3 className="mt-5">
          <Translated str="teams" />
        </h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.teams
              .filter((t) => t.id[0] !== "_")
              .map((team) => (
                <tr key={team.id}>
                  <td>
                    <Link to={"/team/view/" + team.id}>{team.name}</Link>
                  </td>
                  <td>
                    <Link to={"/team/manage/" + team.id}>
                      <img src="/icons/gear.svg" width={32} height={32} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <h3 className="mt-5">
          <Translated str="addMember" />
        </h3>
        <form className="mt-4" onSubmit={this.addMember}>
          <div className="form-group">
            <label htmlFor="newMemberId">
              <Translated str="id" />:
            </label>
            &nbsp;
            <input
              type="text"
              id="newMemberId"
              name="newMemberId"
              required
              value={this.state.newMemberId}
              onChange={this.handleChange}
            />
            &nbsp;
            <button className="btn btn-primary" type="submit">
              +
            </button>
          </div>
        </form>

        <h3 className="mt-5">
          <Translated str="members" />
        </h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.members.map((member) => (
              <tr key={member.account_id}>
                <td>
                  <UserLink
                    id={member.account_id}
                    name={member.first_name + " " + member.last_name}
                    ghost={false}
                  />
                </td>
                <td>
                  <a
                    className="btn btn-danger"
                    onClick={() => this.removeMember(member.account_id)}
                  >
                    X
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

export default Manage;
