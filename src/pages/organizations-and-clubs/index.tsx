import React, { FunctionComponent, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { SearchByFideId } from "./search-by-fide-id";
import "./style.scss";

const defaultPic = "https://via.placeholder.com/150";

const OrganizationsAndClubs: FunctionComponent<{}> = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "organizations-and-clubs-page";
    fetchJson("/s/organization/all", "GET", undefined, (response) => {
      setOrganizations(response);
    });

    fetchJson("/s/club/all", "GET", undefined, (response) => {
      setClubs(response);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{title("browseOrgsAndClubs")}</title>
      </Helmet>
      <SearchByFideId />
      <div className="header">
        {Translated.byKey("browseOrgs").toUpperCase()}
      </div>
      <div className="box">
        <Row>
          {organizations.map((organization, i) => (
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
        </Row>
      </div>

      <div className="header">
        {Translated.byKey("browseClubs").toUpperCase()}
      </div>
      <div className="box">
        <Row>
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
    </>
  );
};

export { OrganizationsAndClubs };
