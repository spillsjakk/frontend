import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchCall, fetchJson, title } from "../../functions";
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
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { HelpBox, helpboxNames } from "../../components/help-box";

const { SearchBar } = Search;

const defaultPic = "https://via.placeholder.com/150";

type ProfileState = {
  account?: Account;
  tournamentData: Tournament[];
  tournamentColumns: any[];
  gameData: any[];
  gameColumns: any[];
  online: boolean;
  clubs: Array<any>;
  organizations: Array<any>;
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
      clubs: [],
      organizations: [],
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

    const userId = this.props.match.params.uid;

    fetchCall(`/s/account/clubs/${userId}`, "GET", undefined, (clubIds) => {
      if (Array.isArray(clubIds)) {
        const clubs = [];
        for (const clubId of clubIds) {
          fetchCall(`/s/club/get-info/${clubId}`, "GET", undefined, (club) => {
            clubs.push(club);
            if (clubs.length === clubIds.length) {
              this.setState({ clubs });
            }
          });
        }
      }
    });

    fetchCall(
      `/s/account/organizations/${userId}`,
      "GET",
      undefined,
      (organizationIds) => {
        if (Array.isArray(organizationIds)) {
          const organizations = [];
          for (const organizationId of organizationIds) {
            fetchCall(
              `/s/organization/get/${organizationId}`,
              "GET",
              undefined,
              (organization) => {
                organizations.push(organization);
                if (organizations.length === organizationIds.length) {
                  this.setState({ organizations });
                }
              }
            );
          }
        }
      }
    );

    fetchJson("/s/profile/" + userId, "GET", undefined, (data) => {
      const tournamentData = data.tournaments;

      const games: Game[] = data.games;
      const gameData = games.map((g) => {
        return {
          id: g.id,
          name: g.white_name + " - " + g.black_name,
          start: TimestampString(g.start),
          tournament: g.tournament_name,
          timeControl: g.initial_time.toString() + "+" + g.increment.toString(),
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
        tournamentData,
        gameData,
        account: data.account,
        online: data.online === "true",
      });
    });
  }

  isUserSelf() {
    return this.props.match.params.uid === this.context.user.info?.id;
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title(this.state.account?.username || "")}</title>
        </Helmet>
        <div className="name-container">
          <div className="info">
            <div className="image">
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
                  src={`https://drulpact.sirv.com/sp/${
                    this.state.online ? "online" : "offline"
                  }-circle.svg`}
                  height={25}
                  width={25}
                  alt={`${this.state.online} ? "online" : "offline"`}
                />
              </OverlayTrigger>
            </div>

            <div className="username">{this.state.account?.username}</div>
          </div>
          {this.isUserSelf() && (
            <HelpBox
              placement="left"
              name={helpboxNames.userProfileAccountSettings}
              text={Translated.byKey("userProfileAccountSettingsHelpbox")}
              show={this.isUserSelf()}
            >
              <div className="settings">
                <Link to="/account/settings">
                  <Translated str="accountSettings" />
                </Link>
              </div>
            </HelpBox>
          )}
        </div>

        <div className="header">{Translated.byKey("memberships")}</div>
        {Array.isArray(this.state.organizations) &&
          Array.isArray(this.state.clubs) && (
            <div className="box">
              <Row>
                {this.state.organizations.map((organization, i) => (
                  <Col key={i} sm="12" md="4">
                    <div className="card-wrapper">
                      <img
                        height="150"
                        width="150"
                        src={organization.profile_picture || defaultPic}
                      />
                      <div className="text">
                        <Link to={"/organization/view/" + organization.id}>
                          {organization.name}
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
                {this.state.clubs.map((club, i) => (
                  <Col key={i} sm="12" md="4">
                    <div className="card-wrapper">
                      <img
                        height="150"
                        width="150"
                        src={club.profile_picture || defaultPic}
                      />
                      <div className="text">
                        <Link to={"/club/view/" + club.id}>{club.name}</Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

        <div className="header">{Translated.byKey("tournamentHistory")}</div>

        <HelpBox
          placement="top"
          name={helpboxNames.userProfileTournament}
          text={Translated.byKey("userProfileTournamentHelpbox")}
          show={this.isUserSelf()}
        >
          <div className="box">
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
          </div>
        </HelpBox>

        <div className="header">{Translated.byKey("gameHistory")}</div>

        <div className="box">
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
        </div>
      </>
    );
  }
}

export default Profile;
