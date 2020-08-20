import React, { Component, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { RouteComponentProps, Link } from "react-router-dom";
import { fetchJson } from "../../functions";

type CreateState = {
  name: string
  id: string
  description: string
}

class Create extends Component<RouteComponentProps, CreateState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      name: "",
      id: "",
      description: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleIdBlur = this.handleIdBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  handleIdBlur(e: React.FocusEvent<HTMLInputElement>) {
    const target = e.target;
    fetchJson(`/s/team/check-id/${target.value}`, "POST", undefined, result => {
      if (result.exists) {
        target.setCustomValidity("already taken");
      } else {
        target.setCustomValidity("");
      }
    });
  }

  handleSubmit(e: FormEvent) {
    e.preventDefault();

    fetchJson(`/s/team/create`, "POST", this.state, result => {
        this.props.history.push(`/team/view/${result.id}`);
    });
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Team-Create";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Create a team</title>
        </Helmet>
        <h1 className="mt-4 p-3"><Translated str="createATeam" /></h1>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name"><Translated str="name" />:</label>
            <input type="text" className="form-control" id="name" name="name" required value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="id"><Translated str="id" />:</label>
            <input type="text" className="form-control" id="id" name="id" required pattern="[A-Za-z0-9_-]+" value={this.state.id} onChange={this.handleChange} onBlur={this.handleIdBlur} />
            <div className="mt-1">
              <small><Translated str="theUrlForThisTeam" /></small>
            </div>
          </div>
          <div className="form-group mt-4">
            <label htmlFor="description"><Translated str="description" />:</label>
            <textarea className="form-control" id="description" name="description" value={this.state.description} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <button className="btn btn-success p-3" type="submit"><Translated str="create" /></button>
          </div>
        </form>
      </>
    );
  }
}

export default Create;