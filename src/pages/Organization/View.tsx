import React, { PureComponent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { Link, RouteComponentProps } from "react-router-dom";
import FederationDisplay from "../../components/FederationDisplay";
import "./View.css";

type ViewProps = {
  oid: string;
};

type ViewState = {
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  country: string;
  clubs: any[];
};

class View extends PureComponent<RouteComponentProps<ViewProps>, ViewState> {
  orgId: string;

  constructor(props: RouteComponentProps<ViewProps>) {
    super(props);

    this.state = {
      id: this.props.match.params.oid,
      name: "",
      description: "",
      profile_picture: "",
      country: "NOR",
      clubs: [],
    };

    this.orgId = this.props.match.params.oid;

    this.loadClubs = this.loadClubs.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Organization-View";

    fetchJson(
      `/s/organization/get/${this.orgId}`,
      "GET",
      undefined,
      (result) => {
        this.setState(
          {
            id: result.id,
            name: result.name,
            description: result.description,
            profile_picture: result.profile_picture,
            country: result.country,
          },
          this.loadClubs
        );
      }
    );
  }

  loadClubs() {
    fetchJson(
      `/s/organization/clubs/${this.state.id}`,
      "GET",
      undefined,
      (clubs) => {
        this.setState({ clubs });
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title(this.state.name)}</title>
        </Helmet>
        <h1 className="mt-5 p-3">{this.state.name}</h1>
        {this.state.profile_picture && (
          <img
            style={{ borderRadius: "50%" }}
            height="50px"
            width="50px"
            src={this.state.profile_picture}
            alt="organization profile picture"
          />
        )}

        <div className="mt-5">
          <FederationDisplay value={this.state.country} />
        </div>
        <div className="mt-3">{this.state.description}</div>

        <h3 className="mt-5">
          <Translated str="clubs" />
        </h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.clubs.map((club) => (
              <tr key={club.id}>
                <td>
                  <Link to={"/club/view/" + club.id}>{club.name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default View;
