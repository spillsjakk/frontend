import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { Team } from "../Tournament/Types";
import { UserContext } from "../../components/UserContext";
import UserLink from "../../components/UserLink";
import { RouteComponentProps, Link } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import { TeamMember } from "./Types";

type ViewProps = {
  tid: string;
}

type ViewState = {
  loaded: boolean
  info?: {
    team: Team
    members: TeamMember[]
  }
}

class View extends Component<RouteComponentProps<ViewProps>, ViewState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: RouteComponentProps<ViewProps>) {
    super(props);

    this.state = { loaded: false };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Team-View";

    fetchJson(`/s/team/view/${this.props.match.params.tid}`, "GET", undefined, result => this.setState({ loaded: true, info: result }));
  }

  render() {
    if (!this.state.loaded) {
      return <>Loading...</>;
    }

    const info = this.state.info!;
    return (
      <>
        <Helmet>
          <title>{title(info.team.name)}</title>
        </Helmet>

        <h1 className="mt-4 p-3">{info.team.name}</h1>

        <p>{info.team.description}</p>

        {this.context.user.authenticated && this.context.user.info?.id === info.team.manager &&
          <Link className="mt-4 p-3 btn btn-primary" to={"/team/manage/" + info.team.id}><Translated str="manage" /></Link>
        }

        <table className="table mt-4">
          {info.members.map(member =>
            <tr>
              <td><UserLink id={member.account_id} name={member.first_name + " " + member.last_name} ghost={false} /></td>
            </tr>
          )}
        </table>
      </>
    );
  }
}

export default View;