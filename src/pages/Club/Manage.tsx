import React, { PureComponent, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import Translated from "../../components/Translated";
import { fetchJson } from "../../functions";
import UserLink from "../../components/UserLink";

type ManageState = {
  exists: boolean
  id: string
  name: string
  description: string
  country: string
  region: string,
  members: any[]
}

class Manage extends PureComponent<{}, ManageState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      exists: false,
      id: "",
      name: "",
      description: "",
      country: "",
      region: "",
      members: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "NotFound";

    fetchJson("/s/club/manage", "GET", undefined, result => {
      if (result.length > 0) {
        this.setState({
          id: result[0].id,
          name: result[0].name,
          description: result[0].description,
          country: result[0].country,
          region: result[0].region,
          exists: true
        }, () => {
          fetchJson(`/s/club/members/${result[0].id}`, "GET", undefined, members => {
            this.setState({ members });
          })
        });
      }
    });
  }

  handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submit(e: FormEvent) {
    e.preventDefault();

    fetchJson(`/s/club/edit`, "POST", this.state, _ => {
      this.setState({ exists: true });
    });
  }

  removeMember(uid: string) {
    fetchJson(`/s/club/remove-member/${this.state.id}/${uid}`, "POST", undefined, _ => {
      const members = [...this.state.members];
      members.splice(members.findIndex(m => m.account_id === uid), 1);
      this.setState({ members });
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Manage clubs</title>
        </Helmet>
        <h1 className="mt-5 p-3"><Translated str="manageClub" /></h1>
        <form className="mt-5" onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="description"><Translated str="name" />:</label>
            <input type="text" className="form-control w-50" id="name" name="name" required value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="id"><Translated str="id" />:</label>
            <input type="text" id="id" className="form-control w-50" name="id" required value={this.state.id} disabled={this.state.exists} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="description"><Translated str="description" />:</label>
            <textarea id="description" className="form-control w-50" name="description" required value={this.state.description} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="country"><Translated str="country" />:</label>
            <input type="text" id="country" className="form-control w-25" name="country" required value={this.state.country} onChange={this.handleChange} />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="region"><Translated str="region" />:</label>
            <input type="text" id="region" className="form-control w-25" name="region" required value={this.state.region} onChange={this.handleChange} />
          </div>
          <div className='mt-4'>
            <button type="submit" className="btn btn-primary"><Translated str="submit" /></button>
          </div>
        </form>

        <h3 className="mt-5 p-3"><Translated str="members" /></h3>
        <table className="mt-4 table">
          <tbody>
            {this.state.members.map(member =>
              <tr key={member.account_id}>
                <td><UserLink id={member.account_id} name={member.first_name + " " + member.last_name} ghost={false} /></td>
                <td><a className="btn btn-danger" onClick={() => this.removeMember(member.account_id)}>X</a></td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default Manage;