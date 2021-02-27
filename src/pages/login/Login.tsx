import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";

import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { UserContext } from "../../components/UserContext";
import { RouteComponentProps, Link } from "react-router-dom";
import "./style.scss";
import { Modal } from "react-bootstrap";

type LoginState = {
  userId: string;
  password: string;
  isAccountModalOpen: boolean;
};

class Login extends PureComponent<RouteComponentProps, LoginState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      userId: "",
      password: "",
      isAccountModalOpen: window.location.hash.includes("account-modal"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Login";
  }

  doLogin(event: FormEvent) {
    event.preventDefault();
    fetchJson(
      "/s/account/login",
      "POST",
      {
        id: this.state.userId,
        password: this.state.password,
      },
      (user) => {
        this.context.setUser(user);

        if (this.props.location.search.startsWith("?path=")) {
          this.props.history.push(
            this.props.location.search.split("=")[1] || "/"
          );
          return;
        }

        if (
          this.props.location.state &&
          (this.props.location.state as any).canGoBack
        ) {
          this.props.history.goBack();
        } else {
          this.props.history.push("/");
        }
      }
    );
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.id === "id") {
      this.setState({ userId: event.target.value });
    } else if (event.target.id === "password") {
      this.setState({ password: event.target.value });
    }
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("login")}</title>
        </Helmet>
        <form onSubmit={this.doLogin}>
          <div className="form-group">
            <label htmlFor="id">
              <Translated str="username" />
            </label>
            <input
              type="text"
              className="form-control"
              name="id"
              id="id"
              value={this.state.userId}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <Translated str="password" />
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button id="submit" className="btn btn-primary">
            <Translated str="login" />
          </button>
          <div>
            <p className="mt-3">
              <Link to="/account/recover">
                <Translated str="forgotPassword" />
              </Link>
            </p>
            <p className="mt-1">
              <Link
                to="#"
                onClick={() => this.setState({ isAccountModalOpen: true })}
              >
                <Translated str="howToMakeAccount" />
              </Link>
            </p>
          </div>
        </form>
        <Modal
          show={this.state.isAccountModalOpen}
          onHide={() => this.setState({ isAccountModalOpen: false })}
        >
          <Modal.Body>
            <Translated str="howToMakeAccountDesc" />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Login;
