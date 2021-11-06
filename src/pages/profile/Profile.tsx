import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import React, { FunctionComponent, useState, useEffect } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { HelpBox, helpboxNames } from "../../components/help-box";
import { TimestampString } from "../../components/Timestamp";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { fetchCall, fetchJson, title } from "../../functions";
import { Account } from "../Tournament/Types";
import "./index.scss";

const commonFields = {
  headerClassName: "table-header",
  cellClassName: "table-cell",
};

const defaultPic = "https://via.placeholder.com/150";

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

const Profile: FunctionComponent<unknown> = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const tournamentColumns: GridColDef[] = [
    {
      field: "tournament",
      headerName: Translated.byKey("tournament"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Link to={"/tournament/view/" + params.row.id}>
              {params.row.name}
            </Link>
          </>
        );
      },
      ...commonFields,
      minWidth: 300,
      flex: 1,
    },
    {
      field: "start_date",
      headerName: Translated.byKey("startDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 300,
      ...commonFields,
    },
    {
      field: "end_date",
      headerName: Translated.byKey("endDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 300,
      ...commonFields,
    },
  ];
  const [gameData, setGameData] = useState([]);
  const gameColumns: GridColDef[] = [
    {
      field: "game",
      headerName: Translated.byKey("game"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
      minWidth: 300,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/game/view/" + params.row.id}>{params.row.name}</Link>
          </>
        );
      },
    },
    {
      field: "start",
      headerName: Translated.byKey("dateTime"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 250,
      ...commonFields,
    },
    {
      field: "tournament",
      headerName: Translated.byKey("tournament"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 250,
      ...commonFields,
    },
    {
      field: "timeControl",
      headerName: Translated.byKey("timeControl"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 100,
      ...commonFields,
    },
    {
      field: "result",
      headerName: Translated.byKey("result"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 100,
      ...commonFields,
    },
  ];
  const [online, setOnline] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [account, setAccount] = useState<Account>();
  const [organization, setOrganization] = useState([]);
  const [pageSize, setPageSize] = React.useState<number>(15);

  const params = useParams<{ uid: string }>();
  const { user } = useUser();

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Profile";

    const userId = params.uid;

    fetchCall(`/s/account/clubs/${userId}`, "GET", undefined, (clubIds) => {
      if (Array.isArray(clubIds)) {
        const clubs = [];
        for (const clubId of clubIds) {
          fetchCall(`/s/club/get-info/${clubId}`, "GET", undefined, (club) => {
            clubs.push(club);
            if (clubs.length === clubIds.length) {
              setClubs(clubs);
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
                  setOrganization(organizations);
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
      const account = data.account;
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
      setTournamentData(tournamentData);
      setGameData(gameData);
      setAccount(account);
      setOnline(data.online === "true");
    });
  }, []);

  function isUserSelf() {
    return params.uid === user.info?.id;
  }

  return (
    <>
      <Helmet>
        <title>{title(account ? account.username : "")}</title>
      </Helmet>
      <div className="name-container">
        <div className="info">
          <div className="image">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="online">
                  {online && <strong>{Translated.byKey("online")}</strong>}
                  {!online && <strong>{Translated.byKey("offline")}</strong>}
                </Tooltip>
              }
            >
              <img
                src={`https://drulpact.sirv.com/sp/${
                  online ? "online" : "offline"
                }-circle.svg`}
                height={25}
                width={25}
                alt={`${online} ? "online" : "offline"`}
              />
            </OverlayTrigger>
          </div>

          <div className="username">{account ? account.username : ""}</div>
        </div>
        {isUserSelf() && (
          <HelpBox
            placement="left"
            name={helpboxNames.userProfileAccountSettings}
            text={Translated.byKey("userProfileAccountSettingsHelpbox")}
            show={isUserSelf()}
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
      {Array.isArray(organization) && Array.isArray(clubs) && (
        <div className="box">
          <Row>
            {organization.map((organization, i) => (
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
            {clubs.map((club, i) => (
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
        show={isUserSelf()}
      >
        <div className="box">
          <DataGrid
            autoHeight
            pageSize={pageSize}
            onPageSizeChange={(pageSize: number) => {
              setPageSize(pageSize);
            }}
            rowsPerPageOptions={[15, 30, 50]}
            pagination
            rows={tournamentData}
            columns={tournamentColumns}
          />
        </div>
      </HelpBox>

      <div className="header">{Translated.byKey("gameHistory")}</div>

      <div className="box">
        <DataGrid
          autoHeight
          pageSize={pageSize}
          onPageSizeChange={(pageSize: number) => {
            setPageSize(pageSize);
          }}
          rowsPerPageOptions={[15, 30, 50]}
          pagination
          rows={gameData}
          columns={gameColumns}
        />
      </div>
    </>
  );
};
export default Profile;
