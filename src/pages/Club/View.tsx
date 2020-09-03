import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { fetchJson } from "../../functions";
import UserLink from "../../components/UserLink";
import { Link, RouteComponentProps } from "react-router-dom";
import FederationDisplay from "../../components/FederationDisplay";

type ViewProps = {
  cid: string
}

type ViewState = {
  exists: boolean
  name: string
  description: string
  country: string
  region: string,
  members: any[],
  teams: any[],
  orgs: any[]
}

class View extends PureComponent<RouteComponentProps<ViewProps>, ViewState> {
  clubId: string;

  constructor(props: RouteComponentProps<ViewProps>) {
    super(props);

    this.clubId = props.match.params.cid;

    this.state = {
      exists: false,
      name: "",
      description: "",
      country: "",
      region: "",
      members: [],
      teams: [],
      orgs: []
    };

    this.loadOrgs = this.loadOrgs.bind(this);
    this.loadMembers = this.loadMembers.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Club-View";

    fetchJson(`/s/club/get-info/${this.clubId}`, "GET", undefined, result => {
      if (result.id) {
        this.setState({
          name: result.name,
          description: result.description,
          country: result.country,
          region: result.region,
          exists: true
        }, () => {
          fetchJson(`/s/club/teams/${this.clubId}`, "GET", undefined, teams => {
            this.setState({ teams }, this.loadMembers);
          });
        });
      }
    });
  }

  loadMembers() {
    fetchJson(`/s/club/members/${this.clubId}`, "GET", undefined, members => {
      this.setState({ members }, this.loadOrgs);
    });
  }

  loadOrgs() {
    fetchJson(`/s/club/organizations/${this.clubId}`, "GET", undefined, orgs => {
      this.setState({ orgs });
    });
  }

  render() {
    if (!this.state.exists) {
      return <>
        <Helmet>
          <title>Club not found</title>
        </Helmet>
        <p>Club not found</p>
      </>;
    }

    return (
      <>
        <Helmet>
          <title>{this.state.name}</title>
        </Helmet>
        <h1 className="mt-5 p-3">{this.state.name}</h1>
        <p className="mt-4">
          {this.state.region}, <FederationDisplay value={this.state.country} />
        </p>
        <p>
          {this.state.description}
        </p>

        <h3 className="mt-5"><Translated str="organizations" /></h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.orgs.map(org =>
              <tr key={org.id}>
                <td><Link to={"/organization/view/" + org.id}>{org.name}</Link></td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="mt-5"><Translated str="teams" /></h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.teams.filter(t => t.id[0] !== "_").map(team =>
              <tr key={team.id}>
                <td><Link to={"/team/view/" + team.id}>{team.name}</Link></td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="mt-5"><Translated str="members" /></h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.members.map(member =>
              <tr key={member.account_id}>
                <td><UserLink id={member.account_id} name={member.first_name + " " + member.last_name} ghost={false} /></td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default View;