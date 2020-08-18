import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';

import Translated from '../components/Translated';
import { fetchJson } from "../functions";
import { UserContext } from "../components/UserContext";
import { RouteComponentProps } from "react-router-dom";

type LoginState = {
  userId: string,
  password: string
}

class Login extends PureComponent<RouteComponentProps, LoginState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { userId: "", password: "" };
    this.handleChange = this.handleChange.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Login";
  }

  doLogin(event: FormEvent) {
    event.preventDefault();
    fetchJson("/s/account/login", "POST", {
      id: this.state.userId,
      password: this.state.password
    }, user => {
      this.context.setUser(user);
      
      if (this.props.location.state && (this.props.location.state as any).canGoBack) {
        this.props.history.goBack();
      } else {
        this.props.history.push("/");
      }
    });
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
          <title>Log in</title>
        </Helmet>
        <form onSubmit={this.doLogin}>
          <div className="form-group">
            <label htmlFor="id"><Translated str="username" /></label>
            <input type="text" className="form-control w-25" name="id" id="id" value={this.state.userId} onChange={this.handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password"><Translated str="password" /></label>
            <input type="password" className="form-control w-25" name="password" id="password" value={this.state.password} onChange={this.handleChange} required />
          </div>
          <button className="btn btn-primary"><Translated str="login" /></button>
        </form>
      </>
    );
  }
}

export default Login;