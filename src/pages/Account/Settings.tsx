import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title, fetchJson } from "../../functions";
import "./Settings.css";

type SettingsState = {
  email: string;
  currentPassword: string;
  newPassword1: string;
  newPassword2: string;
  lichessUsername: string;
};

class Settings extends PureComponent<{}, SettingsState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      email: "",
      currentPassword: "",
      newPassword1: "",
      newPassword2: "",
      lichessUsername: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.onLinkLichessAccount = this.onLinkLichessAccount.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Account-Settings";

    fetchJson(`/s/account/settings`, "GET", undefined, (result) => {
      this.setState({
        email: result.email,
        lichessUsername: result.lichess_username,
      });
    });
  }

  handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  async onLinkLichessAccount() {
    const lichessResponse = await fetch(
      `https://lichess.org/api/users/status?ids=${this.state.lichessUsername}`
    );
    const lichessData = await lichessResponse.json();
    if (!lichessData || !lichessData.length) {
      return;
    }
    fetchJson(
      `/s/account/link/lichess`,
      "POST",
      { lichess_username: this.state.lichessUsername },
      () => {}
    );
  }

  changeEmail(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/account/change-email`,
      "POST",
      { new_email: this.state.email, pwd: this.state.currentPassword },
      (_) => {
        alert(Translated.byKey("emailChanged"));
      }
    );
  }

  changePassword(e: FormEvent) {
    e.preventDefault();

    if (this.state.newPassword1 !== this.state.newPassword2) {
      alert(Translated.byKey("passwordsAreNotEqual"));
      return;
    }

    fetchJson(
      `/s/account/change-password`,
      "POST",
      { new_pwd: this.state.newPassword1, pwd: this.state.currentPassword },
      (_) => {
        this.setState({ newPassword1: "", newPassword2: "" });
        alert(Translated.byKey("passwordChanged"));
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("accountSettings")}</title>
        </Helmet>
        <h1 className="mt-5 p-3">
          <Translated str="accountSettings" />
        </h1>
        <div className="mt-5">
          <Translated str="currentPassword" />
          :&nbsp;
          <input
            type="password"
            name="currentPassword"
            className="w-25"
            value={this.state.currentPassword}
            onChange={this.handleChange}
          />
        </div>

        <form className="mt-5" onSubmit={this.changeEmail}>
          <div className="form-group">
            <label htmlFor="email">
              <Translated str="email" />:
            </label>
            <input
              type="email"
              className="w-25 form-control"
              name="email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <button className="btn btn-primary">
            <Translated str="changeEmail" />
          </button>
        </form>

        <form className="mt-5" onSubmit={this.changePassword}>
          <div className="form-group">
            <label htmlFor="newPassword1">
              <Translated str="newPassword" />:
            </label>
            <input
              type="password"
              className="form-control w-25"
              minLength={7}
              name="newPassword1"
              id="newPassword1"
              value={this.state.newPassword1}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword2">
              <Translated str="newPasswordAgain" />:
            </label>
            <input
              type="password"
              className="form-control w-25"
              minLength={7}
              name="newPassword2"
              id="newPassword2"
              value={this.state.newPassword2}
              onChange={this.handleChange}
              required
            />
          </div>
          <button className="btn btn-primary">
            <Translated str="changePassword" />
          </button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.onLinkLichessAccount();
          }}
        >
          <div className="form-group mt-5">
            <label htmlFor="lichessUsername">
              <Translated str="lichessUsername" />:
            </label>
            <input
              type="text"
              className="form-control w-25"
              minLength={7}
              name="lichessUsername"
              id="lichessUsername"
              value={this.state.lichessUsername}
              onChange={this.handleChange}
              required
            />
          </div>
          <button className="btn btn-primary">
            <Translated str="linkLichessAccount" />
          </button>
        </form>
      </>
    );
  }
}

export default Settings;
