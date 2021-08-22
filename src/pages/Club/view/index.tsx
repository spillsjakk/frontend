import React, { FunctionComponent, useEffect, useState } from "react";
import { Header } from "./header";
import { Banner } from "./banner";
import style from "./style.module.scss";
import "./style.scss";
import { fetchCall } from "../../../functions";
import { Link, useParams } from "react-router-dom";
import { Club } from "../../../context/club";
import { Col, Row } from "react-bootstrap";
import Translated from "../../../components/translated";
import { Tournament } from "../../Tournament/Types";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridPageChangeParams,
} from "@material-ui/data-grid";

const defaultPic = "https://via.placeholder.com/150";

const commonFields = {
  headerClassName: style["table-header"],
  cellClassName: style["table-cell"],
  width: 330,
};

const ClubView: FunctionComponent<{}> = () => {
  const [club, setClub] = useState<Club>();
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  const [members, setMembers] = useState<Array<any>>([]);
  const [teams, setTeams] = useState<Array<any>>();
  const [pageSize, setPageSize] = React.useState<number>(15);

  const { cid } = useParams<{ cid: string }>();

  function loadMembers() {
    fetchCall(`/s/club/members/${cid}`, "GET", undefined, (members) => {
      if (Array.isArray(members))
        setMembers(
          members.map((member) => ({ ...member, id: member.account_id }))
        );
    });
  }

  function getClubInfo() {
    fetchCall(`/s/club/get-info/${cid}`, "GET", undefined, (result) => {
      if (result.id) {
        setClub(result);
        fetchCall(`/s/club/teams/${cid}`, "GET", undefined, (teams) => {
          setTeams(teams);
          loadMembers();
        });
      }
    });
  }

  function getTournaments() {
    fetchCall(
      `/s/tournament/by-organiser/${cid}`,
      "GET",
      undefined,
      (result) => {
        if (Array.isArray(result)) {
          setTournaments(result);
        }
      }
    );
  }

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Club-View";

    getClubInfo();
    getTournaments();
  }, []);

  function getFullName(params) {
    return `${params.row.first_name} ${params.row.last_name}`;
  }

  function renderPlayerCell(params) {
    return (
      <div>
        <Link to={"/profile/" + params.row.account_id}>
          {getFullName(params)}
        </Link>
      </div>
    );
  }

  function getFederation(params) {
    return `${params.row.fidefederation || ""}`;
  }

  function getRating(params) {
    return `${params.row.fiderating || ""}`;
  }

  console.log(members);
  const columns: GridColDef[] = [
    {
      field: "player",
      headerName: Translated.byKey("player"),
      renderCell: renderPlayerCell,
      valueGetter: getFullName,
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
      ...commonFields,
    },
    {
      field: "fide_rating",
      headerName: Translated.byKey("rating"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      valueGetter: getRating,
      ...commonFields,
    },
    {
      field: "federation",
      headerName: Translated.byKey("federation"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      renderCell: getFederation,
      ...commonFields,
    },
  ];

  return (
    <>
      {club && (
        <div className={style.wrapper}>
          <Header />
          <Banner
            profilePicture={club.profile_picture}
            bannerPicture={club.banner_picture}
            name={club.name}
          />
          <p className={style.description}>{club.description}</p>
          <div className={`${style.header} mt-3`}>
            {Translated.byKey("teams")}
          </div>
          <Row className={style.box}>
            {Array.isArray(teams) &&
              teams.map((team, i) => (
                <Col key={i} sm="12" md="4">
                  <div className={style["card-wrapper"]}>
                    <img
                      height="150"
                      width="150"
                      src={team.profile_picture || defaultPic}
                    />
                    <div className={style.text}>
                      <Link to={"/team/view/" + team.id}>{team.name}</Link>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
          <div className={`${style.header} mt-3`}>
            {Translated.byKey("tournaments")}
          </div>
          <div className={style.box}>
            <table className="mt-4 table">
              <tbody>
                {Array.isArray(tournaments) &&
                  tournaments.map((tournament) => (
                    <tr key={tournament.id}>
                      <td>
                        <Link to={"/tournament/view/" + tournament.id}>
                          {tournament.name}
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={`${style.header} mt-3`}>
            {Translated.byKey("members")}
          </div>
          <div className={style.box}>
            <DataGrid
              autoHeight
              pageSize={pageSize}
              onPageSizeChange={(params: GridPageChangeParams) => {
                setPageSize(params.pageSize);
              }}
              rowsPerPageOptions={[15, 30, 50]}
              pagination
              rows={members}
              columns={columns}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { ClubView };
