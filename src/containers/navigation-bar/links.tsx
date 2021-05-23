import { ListItemText, List, ListItem, ListSubheader } from "@material-ui/core";

import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../components/translated/index";
import { Levels, useUser } from "../../components/UserContext";
import style from "./style.module.scss";

const Links: FunctionComponent<unknown> = () => {
  const { user } = useUser();

  // required for rendering when route is changed
  useParams();

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
      hasLevel() ||
      user.info?.powers.organization_all ||
      user.info?.powers.club_all ||
      user.info?.powers.organization_arbiter ||
      user.info?.powers.club_arbiter
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
  return (
    <>
      <nav className={style.links}>
        <div className={style.link}>
          {Translated.byKey("navbarTournaments")}
          <div className={style.menu}>
            <a href="/calendar" className={style.item}>
              {Translated.byKey("myTournamentCalendar")}
            </a>
            {showBuildTournament() && (
              <a href="/tournament/build" className={style.item}>
                {Translated.byKey("buildTournament")}
              </a>
            )}
            {showBuildLeague() && (
              <a href="/league/build" className={style.item}>
                {Translated.byKey("buildLeague")}
              </a>
            )}
          </div>
        </div>
        <div className={style.link}>
          {Translated.byKey("navbarOrgs")}
          <div className={style.menu}>
            <a href="/browse" className={style.item}>
              {Translated.byKey("browse")}
            </a>
            {showManageClub() && (
              <a href="/club/manage" className={style.item}>
                {Translated.byKey("manageClub")}
              </a>
            )}
            {showManageOrganization() && (
              <a href="/organization/manage" className={style.item}>
                {Translated.byKey("manageOrganization")}
              </a>
            )}
          </div>
        </div>

        {showAccountCreation() && (
          <div className={style.link}>
            <>
              {Translated.byKey("navbarAccountCreation")}
              <div className={style.menu}>
                <a href="/account/create" className={style.item}>
                  {Translated.byKey("createAccounts")}
                </a>
                <a
                  href="/registration/generate/invitation"
                  className={style.item}
                >
                  {Translated.byKey("invite")}
                </a>
                {isAdmin() && (
                  <a href="/registration/organization" className={style.item}>
                    {Translated.byKey("createOrganization")}
                  </a>
                )}
              </div>
            </>
          </div>
        )}

        <div className={style.link}>
          {Translated.byKey("navbarInfo")}
          <div className={style.menu}>
            <a href="/about" className={style.item}>
              {Translated.byKey("about")}
            </a>
            <a href="/user-guide" className={style.item}>
              {Translated.byKey("userGuide")}
            </a>
            <a href="/contact" className={style.item}>
              {Translated.byKey("contact")}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

const MobileLinks: FunctionComponent<unknown> = () => {
  const { user } = useUser();

  // required for rendering when route is changed
  useParams();

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
      hasLevel() ||
      user.info?.powers.organization_all ||
      user.info?.powers.club_all ||
      user.info?.powers.organization_arbiter ||
      user.info?.powers.club_arbiter
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
  return (
    <>
      <List component="nav">
        <div>
          <ListSubheader>{Translated.byKey("navbarTournaments")}</ListSubheader>

          <a href="/calendar">
            <ListItem button>
              <ListItemText>
                {Translated.byKey("myTournamentCalendar")}
              </ListItemText>
            </ListItem>
          </a>
          {showBuildTournament() && (
            <a href="/tournament/build">
              <ListItem button>
                <ListItemText>
                  {Translated.byKey("buildTournament")}
                </ListItemText>
              </ListItem>
            </a>
          )}
          {showBuildLeague() && (
            <a href="/league/build">
              <ListItem button>
                <ListItemText>{Translated.byKey("buildLeague")}</ListItemText>
              </ListItem>
            </a>
          )}
        </div>
        <div>
          <ListSubheader>{Translated.byKey("navbarOrgs")}</ListSubheader>
          <a href="/browse">
            <ListItem button>
              <ListItemText>{Translated.byKey("browse")}</ListItemText>
            </ListItem>
          </a>
          {showManageClub() && (
            <a href="/club/manage">
              <ListItem button>
                <ListItemText>{Translated.byKey("manageClub")}</ListItemText>
              </ListItem>
            </a>
          )}
          {showManageOrganization() && (
            <a href="/organization/manage">
              <ListItem button>
                <ListItemText>
                  {Translated.byKey("manageOrganization")}
                </ListItemText>
              </ListItem>
            </a>
          )}
        </div>

        {showAccountCreation() && (
          <div>
            <>
              <ListSubheader>
                {Translated.byKey("navbarAccountCreation")}
              </ListSubheader>
              <a href="/account/create">
                <ListItem button>
                  <ListItemText>
                    {Translated.byKey("createAccounts")}
                  </ListItemText>
                </ListItem>
              </a>
              <a href="/registration/generate/invitation">
                <ListItem button>
                  <ListItemText>{Translated.byKey("invite")}</ListItemText>
                </ListItem>
              </a>
              {isAdmin() && (
                <a href="/registration/organization">
                  <ListItem button>
                    <ListItemText>
                      {Translated.byKey("createOrganization")}
                    </ListItemText>
                  </ListItem>
                </a>
              )}
            </>
          </div>
        )}

        <div>
          <ListSubheader>{Translated.byKey("navbarInfo")}</ListSubheader>
          <a href="/about">
            <ListItem button>
              <ListItemText>{Translated.byKey("about")}</ListItemText>
            </ListItem>
          </a>
          <a href="/user-guide">
            <ListItem button>
              <ListItemText>{Translated.byKey("userGuide")}</ListItemText>
            </ListItem>
          </a>
          <a href="/contact">
            <ListItem button>
              <ListItemText>{Translated.byKey("contact")}</ListItemText>
            </ListItem>
          </a>
        </div>
      </List>
    </>
  );
};

export { Links, MobileLinks };
