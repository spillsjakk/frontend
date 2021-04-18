import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LangSwitcher from "../../components/LangSwitcher";
import Translated from "../../components/translated";
import { Levels, useUser } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { Logo } from "./logo";
import { HelpBox, helpboxNames } from "../../components/help-box";
import "./style.scss";
import { readCookie } from "@mehmetsefabalik/cookie-helper";

const NavigationBar: FunctionComponent<{}> = () => {
  const [hasMessage, setHasMessage] = useState(false);

  const { user, setUser } = useUser();
  const history = useHistory();

  // required for rendering when route is changed
  useParams();

  useEffect(() => {
    if (user && user.authenticated) {
      fetch("/s/messages/has-unread", {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status < 400) {
            return response.json();
          } else {
            return Promise.resolve({ error: response.status.toString() });
          }
        })
        .then((json) => {
          if (!json.error) {
            setHasMessage(!!json.has);
          }
        });
    }
  }, [user]);

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
      window.location.assign("/");
    });
  }

  function anon() {
    return user && user.authenticated === false;
  }

  function authenticated() {
    return user && user.authenticated === true;
  }

  function hasLevel() {
    return user.authenticated && !!user.info?.level && user.info?.level > 0;
  }

  function isOrganizationManager() {
    return (
      user.authenticated &&
      !!user.info?.level &&
      user.info?.level >= Levels.OrganizationManager
    );
  }

  function isAdmin() {
    return (
      user.authenticated &&
      !!user.info?.level &&
      user.info?.level >= Levels.Admin
    );
  }

  function showBuildTournament() {
    return (
      hasLevel() ||
      user.info?.powers.organization_all ||
      user.info?.powers.club_all ||
      user.info?.powers.organization_arbiter ||
      user.info?.powers.club_arbiter
    );
  }

  function showBuildLeague() {
    return (
      (hasLevel() ||
        user.info?.powers.organization_all ||
        user.info?.powers.club_all ||
        user.info?.powers.organization_arbiter ||
        user.info?.powers.club_arbiter) &&
      readCookie("show-build-league") === "true"
    );
  }

  function showManageClub() {
    return (
      hasLevel() ||
      user.info?.powers.organization_all ||
      user.info?.powers.club_all
    );
  }

  function showAccountCreation() {
    return (
      hasLevel() ||
      user.info?.powers.organization_all ||
      user.info?.powers.club_all
    );
  }

  function showManageOrganization() {
    return isOrganizationManager() || user.info?.powers.organization_all;
  }

  function visible() {
    const gamePlayPage = new RegExp("/game/play/.*");
    return !gamePlayPage.test(history.location.pathname);
  }

  return (
    <>
      {visible() && (
        <nav id="navigation-bar">
          <div className="wrapper">
            <div className="left">
              <HelpBox
                placement="right"
                name={helpboxNames.logo}
                text={Translated.byKey("logoHelpbox")}
                show={authenticated()}
              >
                <Logo />
              </HelpBox>
              <nav className="links">
                <div className="link">
                  {Translated.byKey("navbarTournaments")}
                  <div className="menu">
                    <a href="/calendar" className="item">
                      {Translated.byKey("myTournamentCalendar")}
                    </a>
                    {showBuildTournament() && (
                      <a href="/tournament/build" className="item">
                        {Translated.byKey("buildTournament")}
                      </a>
                    )}
                    {showBuildLeague() && (
                      <a href="/league/build" className="item">
                        {Translated.byKey("buildLeague")}
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
                    {showManageClub() && (
                      <a href="/club/manage" className="item">
                        {Translated.byKey("manageClub")}
                      </a>
                    )}
                    {showManageOrganization() && (
                      <a href="/organization/manage" className="item">
                        {Translated.byKey("manageOrganization")}
                      </a>
                    )}
                  </div>
                </div>

                <div className="link">
                  {Translated.byKey("navbarAccountCreation")}
                  {showAccountCreation() && (
                    <>
                      <div className="menu">
                        <a href="/account/create" className="item">
                          {Translated.byKey("createAccounts")}
                        </a>
                        <a
                          href="/registration/generate/invitation"
                          className="item"
                        >
                          {Translated.byKey("invite")}
                        </a>
                        {isAdmin() && (
                          <a href="/registration/organization" className="item">
                            {Translated.byKey("createOrganization")}
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="link">
                  {Translated.byKey("navbarInfo")}
                  <div className="menu">
                    <a href="/about" className="item">
                      {Translated.byKey("about")}
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
                  {hasMessage && <div className="unread-icon"></div>}
                  <HelpBox
                    placement="left"
                    name={helpboxNames.userIcon}
                    text={Translated.byKey("userIconHelpbox")}
                    show={authenticated()}
                  >
                    <img src="/images/user.svg" width="35px" />
                  </HelpBox>
                  <div className="menu">
                    <a href={"/profile/" + user.info?.id} className="item">
                      {user?.info?.name}
                    </a>
                    <a href="/inbox" className="item">
                      {Translated.byKey("inbox")}
                    </a>
                    <a onClick={onLogout} className="item">
                      {Translated.byKey("logout")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export { NavigationBar };
