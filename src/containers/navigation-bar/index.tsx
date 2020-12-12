import React, { FunctionComponent } from "react";
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
                  My Tournament Calendar
                </a>
                {hasLevel() && (
                  <a href="/tournament/build" className="item">
                    Build a Tournament
                  </a>
                )}
              </div>
            </div>
            <div className="link">
              {Translated.byKey("navbarOrgs")}
              <div className="menu">
                <a href="/browse" className="item">
                  Browse
                </a>
                {hasLevel() && (
                  <a href="/club/manage" className="item">
                    Manage Club
                  </a>
                )}
                {isOrganizationManager() && (
                  <a href="/organization/manage" className="item">
                    Manage Organization
                  </a>
                )}
              </div>
            </div>

            <div className="link">
              {Translated.byKey("navbarAccountCreation")}
              {hasLevel() && (
                <div className="menu">
                  <a href="/account/create" className="item">
                    Create Accounts
                  </a>
                  {isAdmin() && (
                    <a href="/account/csv_import" className="item">
                      Bulk Account Creation
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="link">
              {Translated.byKey("navbarInfo")}
              <div className="menu">
                <a href="/about" className="item">
                  About
                </a>
                <a href="/user-guide" className="item">
                  User Guide
                </a>
                <a href="/contact" className="item">
                  Contact
                </a>
              </div>
            </div>
          </nav>
        </div>
        <div className="right links">
          {anon() && (
            <a href="/login">
              <button>{Translated.byKey("navbarLogin")}</button>
            </a>
          )}
          {authenticated() && (
            <div className="link">
              <img src="/images/user.svg" width="35px" />
              <div className="menu">
                <a href="/about" className="item">
                  {user?.info?.name}
                </a>
                <a href="/" onClick={onLogout} className="item">
                  Logout
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
