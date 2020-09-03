import React, { Component, ChangeEvent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { UserContext } from "../../components/UserContext";
import UserLink from "../../components/UserLink";
import { fetchJson, title } from "../../functions";
import "./Create.css";
import FederationDropdown from "../../components/FederationDropdown";
import TitleDropdown from "../../components/TitleDropdown";
import SexDropdown from "../../components/SexDropdown";

type CreateState = {
  first_name: string
  last_name: string
  fide_number: string
  title: string
  fide_rating: string
  fide_federation: string
  birth_date: string
  sex: string
  level: string
  accounts: any[]
  passwords: string[][]
  passwordCsv: string
}

class Create extends Component<{}, CreateState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: {}) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      fide_number: "",
      title: "",
      fide_rating: "",
      fide_federation: "NOR",
      birth_date: "",
      sex: "M",
      level: "0",
      accounts: [],
      passwords: [],
      passwordCsv: "data:text/plain;charset=utf-8,"
    };

    this.handleChange = this.handleChange.bind(this);
    this.fideNumberBlur = this.fideNumberBlur.bind(this);
    this.addNewAcc = this.addNewAcc.bind(this);
  }

  handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const newState: any = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  fideNumberBlur() {
    if (isNaN(parseInt(this.state.fide_number as string, 10))) {
      return;
    }

    fetchJson(`/s/account/fide-autocomplete/${this.state.fide_number}`, "GET", undefined, json => {
      const newState: any = {};
      newState.first_name = json.first_name;
      newState.last_name = json.last_name;
      newState.title = json.title;
      newState.fide_rating = json.rating;
      newState.fide_federation = json.federation;
      newState.birth_date = json.birth_year ? json.birth_year.toString() + "-01-01" : undefined;
      newState.sex = json.sex;
      this.setState(newState);
    });
  }

  addNewAcc() {
    const data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      fide_number: parseInt(this.state.fide_number, 10) || undefined,
      title: this.state.title || undefined,
      fide_rating: parseInt(this.state.fide_rating, 10) || undefined,
      fide_federation: this.state.fide_federation || undefined,
      birth_date: this.state.birth_date || undefined,
      sex: this.state.sex || undefined,
      level: parseInt(this.state.level, 10) || 0,
      ghost: false
    };
    fetchJson(`/s/account/create`, "POST", data, result => {
      result.level = data.level;
      this.setState({
        first_name: "",
        last_name: "",
        fide_number: "",
        title: "",
        fide_rating: "",
        fide_federation: "NOR",
        birth_date: "",
        sex: "",
        accounts: this.state.accounts.concat([result]),
        passwords: this.state.passwords.concat([ [ result.id, result.password ]]),
        passwordCsv: this.state.passwordCsv + encodeURIComponent(`${result.id},${result.password}\n`)
      });
    });
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Account-Create";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("createAccounts")}</title>
        </Helmet>
        <h1 className="mt-5 p-3"><Translated str="createAccounts" /></h1>

        <table className="table">
          <thead>
            <tr>
              <th scope="col"><Translated str="firstName" /></th>
              <th scope="col"><Translated str="lastName" /></th>
              <th scope="col"><Translated str="fideNumber" /></th>
              <th scope="col"><Translated str="title" /></th>
              <th scope="col"><Translated str="fideRating" /></th>
              <th scope="col"><Translated str="fideFederation" /></th>
              <th scope="col"><Translated str="birthDate" /></th>
              <th scope="col"><Translated str="sex" /></th>
              <th scope="col"><Translated str="permissions" /></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.accounts.map(account =>
              <tr>
                <td>
                  <UserLink id={account.id} name={account.first_name} ghost={false} />
                </td>
                <td>
                  <UserLink id={account.id} name={account.last_name} ghost={false} />
                </td>
                <td>{account.fide_number}</td>
                <td>{account.title}</td>
                <td>{account.fide_rating}</td>
                <td>{account.fide_federation}</td>
                <td>{account.birth_date}</td>
                <td>{account.sex}</td>
                <td>{account.level}</td>
              </tr>
            )}
            <tr>
              <td><input type="text" id="firstNameInput" name="first_name" value={this.state.first_name} onChange={this.handleChange} /></td>
              <td><input type="text" id="lastNameInput" name="last_name" value={this.state.last_name} onChange={this.handleChange} /></td>
              <td><input type="number" id="fideNumberInput" name="fide_number" value={this.state.fide_number} onChange={this.handleChange} onBlur={this.fideNumberBlur} /></td>
              <td><TitleDropdown id="titleInput" name="title" value={this.state.title} onChange={this.handleChange} /></td>
              <td><input type="number" id="fideRatingInput" name="fide_rating" value={this.state.fide_rating} onChange={this.handleChange} /></td>
              <td><FederationDropdown id="fideFederationInput" name="fide_federation" value={this.state.fide_federation} onChange={this.handleChange} /></td>
              <td><input type="date" id="birthDateInput" name="birth_date" value={this.state.birth_date} onChange={this.handleChange} /></td>
              <td><SexDropdown id="sexInput" name="sex" value={this.state.sex} onChange={this.handleChange} /></td>
              <td>
                <select id="level" name="level" value={this.state.level} onChange={this.handleChange}>
                  <option value="0" selected>Participant</option>
                  {(this.context.user.info?.level || 0) > 1 && <>
                    <option value="1">Team Manager</option>
                    {(this.context.user.info?.level || 0) > 2 && <>
                      <option value="2">Tournament Organizer</option>
                      {(this.context.user.info?.level || 0) > 3 &&
                        <option value="3">Federation</option>
                      }
                    </>}
                  </>}
                </select>
              </td>
              <td><a className="btn btn-primary" id="addButton" onClick={this.addNewAcc}>+</a></td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5"><Translated str="passwords" /></h3>
        <p><Translated str="thisIsTheOnlyTimeYouSeeThesePasswords" /></p>
        <p><a href={this.state.passwordCsv} download="accounts.csv" id="csvDownloadLink"><Translated str="downloadAsCsv" /></a></p>
        <div>
          {this.state.passwords.map(up => <p>{up[0]}: <code>{up[1]}</code></p>)}
        </div>
      </>
    );
  }
}

export default Create;