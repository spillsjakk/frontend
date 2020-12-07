import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { Link } from "react-router-dom";
import FederationDropdown from "../../components/FederationDropdown";

type ManageState = {
  exists: boolean;
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  country: string;
  clubs: any[];
  newClubId: string;
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
      clubs: [],
      newClubId: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.loadClubs = this.loadClubs.bind(this);
    this.removeClub = this.removeClub.bind(this);
    this.addClub = this.addClub.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Organization-Manage";

    fetchJson("/s/organization/manage", "GET", undefined, (result) => {
      if (result.length > 0) {
        this.setState(
          {
            id: result[0].id,
            name: result[0].name,
            description: result[0].description,
            profile_picture: result[0].profile_picture,
            country: result[0].country,
            exists: true,
          },
          this.loadClubs
        );
      }
    });
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

    fetchJson(`/s/organization/edit`, "POST", this.state, (_) => {
      this.setState({ exists: true });
    });
  }

  removeClub(cid: string) {
    fetchJson(
      `/s/organization/remove-club/${this.state.id}/${cid}`,
      "POST",
      undefined,
      (_) => {
        const clubs = [...this.state.clubs];
        clubs.splice(
          clubs.findIndex((c) => c.id === cid),
          1
        );
        this.setState({ clubs });
      }
    );
  }

  addClub(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/organization/add-club/${this.state.id}/${this.state.newClubId}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ newClubId: "" }, this.loadClubs);
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("manageOrganization")}</title>
        </Helmet>
        <h1 className="mt-5 p-3">
          <Translated str="manageOrganization" />
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
              className="form-control w-25"
              name="country"
              id="country"
              value={this.state.country}
              onChange={this.handleChange}
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              <Translated str="submit" />
            </button>
          </div>
        </form>

        <div className="mt-5">
          <Link to={"/organization/all-accounts/" + this.state.id}>
            <Translated str="accountList" />
          </Link>{" "}
          |{" "}
          <Link to={"/organization/statistics/" + this.state.id}>
            <Translated str="statistics" />
          </Link>
        </div>

        <h3 className="mt-5">
          <Translated str="addClub" />
        </h3>
        <form className="mt-4" onSubmit={this.addClub}>
          <div className="form-group">
            <label htmlFor="newClubId">
              <Translated str="id" />:
            </label>
            &nbsp;
            <input
              type="text"
              id="newClubId"
              name="newClubId"
              required
              value={this.state.newClubId}
              onChange={this.handleChange}
            />
            &nbsp;
            <button className="btn btn-primary" type="submit">
              +
            </button>
          </div>
        </form>

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
                <td>
                  <a
                    className="btn btn-danger"
                    onClick={() => this.removeClub(club.id)}
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
