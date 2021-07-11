import React, { FunctionComponent } from "react";
import { Col, Row } from "react-bootstrap";
import { useUserRegistration } from "../../../../context/registration";
import FederationDropdown from "../../../../components/FederationDropdown";
import SexDropdown from "../../../../components/SexDropdown";
import Translated from "../../../../components/translated";
import style from "./style.module.scss";
import { useInvitation } from "../../../../context/invitation";
import { Link } from "react-router-dom";

const Form: FunctionComponent<{}> = () => {
  const userRegistration = useUserRegistration();
  const { invitation } = useInvitation();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        userRegistration.register(invitation.id);
      }}
    >
      <div className={style["input-group"]}>
        <label htmlFor="username" className={`${style.label} bold`}>
          {Translated.byKey("username")}
        </label>
        <input
          id="username"
          pattern="^[a-zA-Z0-9-_]+$"
          value={userRegistration.user.username}
          onChange={(e) => userRegistration.changeUsername(e.target.value)}
          required
        />
      </div>
      <Row>
        <Col sm="auto">
          <div className={style["input-group"]}>
            <label htmlFor="firstName" className={`${style.label} bold`}>
              {Translated.byKey("firstName")}
            </label>
            <input
              id="firstName"
              value={userRegistration.user.firstName}
              pattern="^[a-zA-Z0-9-_\sÅåÆæØø]+$"
              onChange={(e) => userRegistration.changeFirstname(e.target.value)}
              required
            />
          </div>
        </Col>
        <Col sm="auto">
          <div className={style["input-group"]}>
            <label htmlFor="lastName" className={`${style.label} bold`}>
              {Translated.byKey("lastName")}
            </label>
            <input
              id="lastName"
              value={userRegistration.user.lastName}
              pattern="^[a-zA-Z0-9-_\sÅåÆæØø]+$"
              onChange={(e) => userRegistration.changeLastname(e.target.value)}
              required
            />
          </div>
        </Col>
      </Row>
      {userRegistration.user.title && userRegistration.user.rating && (
        <Row>
          <Col sm="auto">
            <div className={style["input-group"]}>
              <label htmlFor="title" className={`${style.label} bold`}>
                {Translated.byKey("title")}
              </label>
              <input id="title" value={userRegistration.user.title} disabled />
            </div>
          </Col>
          <Col sm="auto">
            <div className={style["input-group"]}>
              <label htmlFor="rating" className={`${style.label} bold`}>
                {Translated.byKey("rating")}
              </label>
              <input
                id="rating"
                value={userRegistration.user.rating}
                disabled
              />
            </div>
          </Col>
        </Row>
      )}
      <p
        dangerouslySetInnerHTML={{
          __html: `${Translated.byKey("namePrivacyInfo").replace(
            "$privacypolicy",
            `<Link to="/privacy-notice" target="__blank">${Translated.byKey(
              "privacyPolicy"
            )}</a>`
          )}`,
        }}
      ></p>
      <div className={style["input-group"]}>
        <label htmlFor="password" className={`${style.label} bold`}>
          {Translated.byKey("password")}
        </label>
        <input
          id="password"
          value={userRegistration.user.password}
          onChange={(e) => userRegistration.changePassword(e.target.value)}
          required
          type="password"
          autoComplete="new-password"
        />
      </div>
      <div className={style["input-group"]}>
        <label htmlFor="country" className={`${style.label} bold`}>
          {Translated.byKey("country")}
        </label>
        <FederationDropdown
          id="country"
          required
          value={userRegistration.user.country}
          onChange={(e) => userRegistration.changeCountry(e.target.value)}
        />
      </div>
      <div className={style["input-group"]}>
        <label htmlFor="gender" className={`${style.label} bold`}>
          {Translated.byKey("gender")}
        </label>
        <SexDropdown
          value={userRegistration.user.gender}
          id="gender"
          onChange={(e) => userRegistration.changeGender(e.target.value)}
        />
      </div>
      <p>{Translated.byKey("notDisplayedPublicly")}</p>
      <div className={style["input-group"]}>
        <label htmlFor="birthday" className={`${style.label} bold`}>
          {Translated.byKey("birthDate")}
        </label>
        <input
          value={userRegistration.user.birthDate}
          id="birthday"
          type="date"
          onChange={(e) => userRegistration.changeBirthdate(e.target.value)}
          required
        />
      </div>
      <p>{Translated.byKey("notDisplayedPublicly")}</p>
      <div className={style["input-group"]}>
        <label htmlFor="email" className={`${style.label} bold`}>
          {Translated.byKey("email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={userRegistration.user.email}
          onChange={(e) => userRegistration.changeEmail(e.target.value)}
        />
      </div>
      <p>{Translated.byKey("notDisplayedPublicly")}</p>
      <input required id="contract" type="checkbox" />
      <label style={{ marginLeft: "10px" }} htmlFor="contract">
        I agree with <Link to="/user-agreement">User Agreement</Link> and{" "}
        <Link to="/privacy-notice">Privacy Notice</Link>
      </label>
      <button
        className="action-button"
        type="submit"
        style={{ display: "block" }}
      >
        {Translated.byKey("create")}
      </button>
    </form>
  );
};

export { Form };
