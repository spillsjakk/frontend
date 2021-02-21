import React, { FunctionComponent, useEffect, useState } from "react";
import { Header } from "./header";
import { Banner } from "./banner";
import style from "./style.module.scss";
import "./style.scss";
import { fetchCall } from "../../../functions";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Translated from "../../../components/translated";

const defaultPic = "https://via.placeholder.com/150";

const OrganizationView: FunctionComponent<{}> = () => {
  const [org, setOrg] = useState<any>();
  const [clubs, setClubs] = useState<Array<any>>();

  const { oid } = useParams<{ oid: string }>();

  function getClubInfo() {
    fetchCall(`/s/organization/get/${oid}`, "GET", undefined, (result) => {
      if (result.id) {
        setOrg(result);
        fetchCall(`/s/organization/clubs/${oid}`, "GET", undefined, (clubs) => {
          setClubs(clubs);
        });
      }
    });
  }

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "Club-View";

    getClubInfo();
  }, []);

  return (
    <>
      {org && (
        <div className={style.wrapper}>
          <Header />
          <Banner
            profilePicture={org.profile_picture}
            bannerPicture={org.banner_picture}
            name={org.name}
          />
          <p className={style.description}>{org.description}</p>
          <div className={`${style.header} mt-3`}>
            {Translated.byKey("clubs")}
          </div>
          <Row className={style.box}>
            {Array.isArray(clubs) &&
              clubs.map((club, i) => (
                <Col key={i} sm="12" md="4">
                  <div className={style["card-wrapper"]}>
                    <img
                      height="150"
                      width="150"
                      src={club.profile_picture || defaultPic}
                    />
                    <div className={style.text}>
                      <Link to={"/club/view/" + club.id}>{club.name}</Link>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      )}
    </>
  );
};

export { OrganizationView };
