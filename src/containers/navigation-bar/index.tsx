import React, { FunctionComponent } from "react";
import LangSwitcher from "../../components/LangSwitcher";
import Translated from "../../components/translated";
import { Levels, useUser } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { Logo } from "./logo";
import "./style.scss";

const NavigationBar: FunctionComponent<{}> = () => {
  const { user, setUser } = useUser();

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
    });
  }

  function anon() {
    return user && user.authenticated === false;
  }

  function authenticated() {
    return user && user.authenticated === true;
  }

  function hasLevel() {
    return user.authenticated && user.info?.level && user.info?.level > 0;
  }

  function isOrganizationManager() {
    return (
      user.authenticated &&
      user.info?.level &&
      user.info?.level >= Levels.OrganizationManager
    );
  }

  function isAdmin() {
    return (
      user.authenticated && user.info?.level && user.info?.level >= Levels.Admin
    );
  }

  return (
    <header id="navigation-bar">
      <div className="wrapper">
        <div className="left">
          <Logo />
          <nav className="links">
            <div className="link">
              {Translated.byKey("navbarTournaments")}
              <div className="menu">
                <a href="/game/lobby" className="item">
                  {Translated.byKey("myTournamentCalendar")}
                </a>
                {hasLevel() && (
                  <a href="/tournament/build" className="item">
                    {Translated.byKey("buildTournament")}
                  </a>
                )}
              </div>
            </div>
            <div className="link">
              {Translated.byKey("navbarOrgs")}
              <div className="menu">
                <a href="/browse" className="item">
                  {Translated.byKey("browse")}
                </a>
                {hasLevel() && (
                  <a href="/club/manage" className="item">
                    {Translated.byKey("manageClub")}
                  </a>
                )}
                {isOrganizationManager() && (
                  <a href="/organization/manage" className="item">
                    {Translated.byKey("manageOrganization")}
                  </a>
                )}
              </div>
            </div>

            <div className="link">
              {Translated.byKey("navbarAccountCreation")}
              {hasLevel() && (
                <div className="menu">
                  <a href="/account/create" className="item">
                    {Translated.byKey("createAccounts")}
                  </a>
                  {isAdmin() && (
                    <a href="/account/csv_import" className="item">
                      {Translated.byKey("manageClub")}
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="link">
              {Translated.byKey("navbarInfo")}
              <div className="menu">
                <a href="/about" className="item">
                  {Translated.byKey("manageClub")}
                </a>
                <a href="/user-guide" className="item">
                  {Translated.byKey("userGuide")}
                </a>
                <a href="/contact" className="item">
                  {Translated.byKey("contact")}
                </a>
              </div>
            </div>
          </nav>
        </div>
        <div className="right links">
          <LangSwitcher />
          {anon() && (
            <a href="/login">
              <button>{Translated.byKey("navbarLogin")}</button>
            </a>
          )}
          {authenticated() && (
            <div className="link">
              <img src="/images/user.svg" width="35px" />
              <div className="menu">
                <a href={"/profile/" + user.info?.id} className="item">
                  {user?.info?.name}
                </a>
                <a href="/" onClick={onLogout} className="item">
                  {Translated.byKey("logout")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { NavigationBar };
