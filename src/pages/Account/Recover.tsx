import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import "./Recover.css";

type RecoverProps = {
  b64?: string;
};

type RecoverState = {
  showPasswordInput: boolean;
  userId: string;
  recoveryCode: string;
  newPassword1: string;
  newPassword2: string;
  message: number;
  email: string;
};

class Recover extends PureComponent<
  RouteComponentProps<RecoverProps>,
  RecoverState
> {
  constructor(props: RouteComponentProps<RecoverProps>) {
    super(props);

    this.state = {
      showPasswordInput: !!this.props.match.params.b64,
      userId: "",
      recoveryCode: "",
      newPassword1: "",
      newPassword2: "",
      message: 0,
      email: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitRecovery = this.submitRecovery.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
  }

  componentDidMount() {
    document.body.id = "Account-Recover";

    if (this.props.match.params.b64) {
      fetchJson(
        `/s/account/test-recovery/${this.props.match.params.b64}`,
        "POST",
        undefined,
        (result) => {
          if (result.valid) {
            const decoded = atob(this.props.match.params.b64!);
            const split = decoded.split(":");
            this.setState({
              userId: split[0],
              recoveryCode: split[1],
            });
          } else {
            this.setState({
              message: 1,
            });
          }
        }
      );
    }
  }

  handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitRecovery(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/account/recover/${this.state.email}`,
      "POST",
      undefined,
      (_) => {
        this.setState({ message: 2 });
      }
    );
  }

  submitNewPassword(e: FormEvent) {
    e.preventDefault();

    if (this.state.newPassword1 === this.state.newPassword2) {
      fetchJson(
        `/s/account/finish-recovery`,
        "POST",
        {
          account: this.state.userId,
          recovery_code: this.state.recoveryCode,
          new_password: this.state.newPassword1,
        },
        (_) => {
          this.props.history.push("/login");
        }
      );
    } else {
      alert("Passwords are not equal.");
    }
  }

  render() {
    if (this.state.message === 1) {
      return (
        <>
          <Translated str="invalidPasswordRecoveryCode" />
        </>
      );
    } else if (this.state.message === 2) {
      return (
        <>
          <Translated str="passwordRecoveryEmailSent" />
        </>
      );
    }

    return (
      <>
        <Helmet>
          <title>{title("recoverAccount")}</title>
        </Helmet>

        <h1 className="mt-5 p-3">
          <Translated str="recoverAccount" />
        </h1>

        <div className="mt-4"></div>

        {!this.state.showPasswordInput ? (
          <>
            <form onSubmit={this.submitRecovery}>
              <div className="form-group">
                <label htmlFor="userId">
                  <Translated str="email" />
                </label>
                <input
                  type="email"
                  className="form-control w-25"
                  name="email"
                  id="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <button className="btn btn-primary">
                <Translated str="recover" />
              </button>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={this.submitNewPassword}>
              <div className="form-group">
                <label htmlFor="newPassword1">
                  <Translated str="newPassword" />
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
                  <Translated str="newPasswordAgain" />
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
                <Translated str="submit" />
              </button>
            </form>
          </>
        )}
      </>
    );
  }
}

export default Recover;
