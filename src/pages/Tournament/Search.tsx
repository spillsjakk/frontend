import React, { Component, ChangeEvent, FormEvent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/translated";
import { Tournament } from "./Types";
import { Link } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import "./Search.css";

type SearchState = {
  query: string,
  results: Tournament[]
}

class Search extends Component<{}, SearchState> {
  constructor(props: {}) {
    super(props);

    this.state = { query: "", results: [] };

    this.getResults = this.getResults.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-Search";
  }

  getResults(e: FormEvent) {
    e.preventDefault();

    fetchJson(`/s/tournament/search?q=${encodeURIComponent(this.state.query)}`, "GET", undefined, json => {
      this.setState({ results: json.results });
    });
  }

  onChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ query: e.target.value });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("searchTournaments")}</title>
        </Helmet>
        <h1 className="mt-4 p-3">
          <Translated str="searchTournaments" />
        </h1>
        <form className="mt-5" onSubmit={this.getResults}>
          <div className="d-flex align-items-stretch">
            <input name="q" value={this.state.query} className="flex-fill" onChange={this.onChange} />
            <button type="submit" className="btn btn-primary">
              <img className="icon" src="/icons/search.svg" alt="?" />
            </button>
          </div>
        </form>

        <table className="mt-3 table">
          {this.state.results.map(tournament =>
            <tr>
              <td><Link to={"/tournament/view/" + tournament.id}>{tournament.name}</Link></td>
              <td>{tournament.start_date}</td>
              <td>{tournament.end_date}</td>
            </tr>
          )}
        </table>
      </>
    );
  }
}

export default Search;