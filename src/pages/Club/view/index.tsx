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
import UserLink from "../../../components/UserLink";
import { Tournament } from "../../Tournament/Types";

const defaultPic = "https://via.placeholder.com/150";

const ClubView: FunctionComponent<{}> = () => {
  const [club, setClub] = useState<Club>();
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  const [members, setMembers] = useState<Array<any>>();
  const [teams, setTeams] = useState<Array<any>>();

  const { cid } = useParams<{ cid: string }>();

  function loadMembers() {
    fetchCall(`/s/club/members/${cid}`, "GET", undefined, (members) => {
      setMembers(members);
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
            <table className="mt-4 table">
              <tbody>
                {Array.isArray(members) &&
                  members.map((member) => (
                    <tr key={member.account_id}>
                      <td>
                        <UserLink
                          id={member.account_id}
                          name={member.first_name + " " + member.last_name}
                          ghost={false}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export { ClubView };
