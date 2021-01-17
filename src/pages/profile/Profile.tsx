import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { RouteComponentProps, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Account } from "../Tournament/Types";
import ToolkitProvider, {
  Search,
  SearchMatchProps,
} from "react-bootstrap-table2-toolkit";
import { TimestampString } from "../../components/Timestamp";
import { UserContext } from "../../components/UserContext";
import "./index.scss";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const { SearchBar } = Search;

type ProfileState = {
  name: string;
  account?: Account;
  tournamentData: Tournament[];
  tournamentColumns: any[];
  gameData: any[];
  gameColumns: any[];
  online: boolean;
};

type Tournament = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

type Game = {
  id: string;
  white_name: string;
  black_name: string;
  start: string;
  tournament_name: string;
  initial_time: number;
  increment: number;
  outcome: number;
};

type ProfileParams = {
  uid: string;
};

class Profile extends Component<
  RouteComponentProps<ProfileParams>,
  ProfileState
> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: RouteComponentProps<ProfileParams>) {
    super(props);
    this.state = {
      name: "",
      tournamentData: [],
      tournamentColumns: [
        {
          dataField: "tournament",
          text: Translated.byKey("tournament"),
          formatter: function (_: any, row: Tournament, __: any, ___: any) {
            return <Link to={"/tournament/view/" + row.id}>{row.name}</Link>;
          },
        },
        {
          dataField: "start_date",
          text: Translated.byKey("startDate"),
          sort: true,
        },
        {
          dataField: "end_date",
          text: Translated.byKey("endDate"),
          sort: true,
        },
      ],
      gameData: [],
      gameColumns: [
        {
          dataField: "game",
          text: Translated.byKey("game"),
          formatter: function (_: any, row: Tournament, __: any, ___: any) {
            return <Link to={"/game/view/" + row.id}>{row.name}</Link>;
          },
        },
        { dataField: "start", text: Translated.byKey("dateTime"), sort: true },
        {
          dataField: "tournament",
          text: Translated.byKey("tournament"),
          sort: true,
        },
        {
          dataField: "timeControl",
          text: Translated.byKey("timeControl"),
          sort: true,
        },
        { dataField: "result", text: Translated.byKey("result"), sort: true },
      ],
      online: false,
    };
  }

  onColumnMatch({ searchText, value, column, row }: SearchMatchProps<any>) {
    return (
      (value && value.toLowerCase().includes(searchText)) ||
      row.id.toLowerCase().includes(searchText) ||
      row.name.toLowerCase().includes(searchText)
    );
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Profile";

    fetchJson(
      "/s/profile/" + this.props.match.params.uid,
      "GET",
      undefined,
      (data) => {
        const tournamentData = data.tournaments;

        const games: Game[] = data.games;
        const gameData = games.map((g) => {
          return {
            id: g.id,
            name: g.white_name + " - " + g.black_name,
            start: TimestampString(g.start),
            tournament: g.tournament_name,
            timeControl:
              g.initial_time.toString() + "+" + g.increment.toString(),
            result: (function (r: number | undefined) {
              switch (r) {
                case 1:
                  return "1-0";
                case 0:
                  return "½-½";
                case -1:
                  return "0-1";
                default:
                  return "*";
              }
            })(g.outcome),
          };
        });
        this.setState({
          name: data.name,
          tournamentData,
          gameData,
          account: data.account,
          online: data.online === "true",
        });
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title(this.state.name)}</title>
        </Helmet>
        <div className="name-container">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="online">
                {this.state.online && (
                  <strong>{Translated.byKey("online")}</strong>
                )}
                {!this.state.online && (
                  <strong>{Translated.byKey("offline")}</strong>
                )}
              </Tooltip>
            }
          >
            <img
              src={`/images/${
                this.state.online ? "online" : "offline"
              }-circle.svg`}
              height={25}
              width={25}
              alt={`this.state.online ? "online" : "offline"`}
            />
          </OverlayTrigger>
          <h1 className="mt-4 p-3">{this.state.name}</h1>
        </div>

        {this.props.match.params.uid === this.context.user.info?.id && (
          <div className="mt-4">
            <Link to="/account/settings">
              <Translated str="accountSettings" />
            </Link>
          </div>
        )}

        <div className="mt-5">
          <Translated str="fideRating" />:{" "}
          {this.state.account?.fide_rating || "-"}&nbsp;|&nbsp;
          <Translated str="provisionalFideRating" />:{" "}
          {this.state.account?.provisional_fide_rating || "-"}
        </div>

        <div className="mt-5"></div>

        <ToolkitProvider
          keyField="id"
          data={this.state.tournamentData}
          columns={this.state.tournamentColumns}
          bootstrap4={true}
          search={{ onColumnMatch: this.onColumnMatch }}
        >
          {(props) => (
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory({})}
              />
            </>
          )}
        </ToolkitProvider>

        <div className="mt-5"></div>

        <ToolkitProvider
          keyField="id"
          data={this.state.gameData}
          columns={this.state.gameColumns}
          bootstrap4={true}
          search={{ onColumnMatch: this.onColumnMatch }}
        >
          {(props) => (
            <>
              <SearchBar {...props.searchProps} />
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory({})}
              />
            </>
          )}
        </ToolkitProvider>
      </>
    );
  }
}

export default Profile;
