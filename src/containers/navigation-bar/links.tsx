import { ListItemText, List, ListItem, ListSubheader } from "@material-ui/core";
import React, { forwardRef, FunctionComponent } from "react";
import { Link, useParams } from "react-router-dom";
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
            <Link to="/calendar" className={style.item}>
              {Translated.byKey("myTournamentCalendar")}
            </Link>
            {showBuildTournament() && (
              <Link to="/tournament/build" className={style.item}>
                {Translated.byKey("buildTournament")}
              </Link>
            )}
            {showBuildLeague() && (
              <Link to="/league/build" className={style.item}>
                {Translated.byKey("buildLeague")}
              </Link>
            )}
          </div>
        </div>
        <div className={style.link}>
          {Translated.byKey("navbarOrgs")}
          <div className={style.menu}>
            <Link to="/browse" className={style.item}>
              {Translated.byKey("browse")}
            </Link>
            {showManageClub() && (
              <Link to="/club/manage" className={style.item}>
                {Translated.byKey("manageClub")}
              </Link>
            )}
            {showManageOrganization() && (
              <Link to="/organization/manage" className={style.item}>
                {Translated.byKey("manageOrganization")}
              </Link>
            )}
          </div>
        </div>

        {showAccountCreation() && (
          <div className={style.link}>
            <>
              {Translated.byKey("navbarAccountCreation")}
              <div className={style.menu}>
                <Link to="/account/create" className={style.item}>
                  {Translated.byKey("createAccounts")}
                </Link>
                <Link
                  to="/registration/generate/invitation"
                  className={style.item}
                >
                  {Translated.byKey("invite")}
                </Link>
                {isAdmin() && (
                  <Link to="/registration/organization" className={style.item}>
                    {Translated.byKey("createOrganization")}
                  </Link>
                )}
              </div>
            </>
          </div>
        )}

        <div className={style.link}>
          {Translated.byKey("navbarInfo")}
          <div className={style.menu}>
            <Link to="/about" className={style.item}>
              {Translated.byKey("about")}
            </Link>
            <Link to="/user-guide" className={style.item}>
              {Translated.byKey("userGuide")}
            </Link>
            <Link to="/contact" className={style.item}>
              {Translated.byKey("contact")}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

const MobileLinks: FunctionComponent<any> = forwardRef(() => {
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

          <Link to="/calendar">
            <ListItem button>
              <ListItemText>
                {Translated.byKey("myTournamentCalendar")}
              </ListItemText>
            </ListItem>
          </Link>
          {showBuildTournament() && (
            <Link to="/tournament/build">
              <ListItem button>
                <ListItemText>
                  {Translated.byKey("buildTournament")}
                </ListItemText>
              </ListItem>
            </Link>
          )}
          {showBuildLeague() && (
            <Link to="/league/build">
              <ListItem button>
                <ListItemText>{Translated.byKey("buildLeague")}</ListItemText>
              </ListItem>
            </Link>
          )}
        </div>
        <div>
          <ListSubheader>{Translated.byKey("navbarOrgs")}</ListSubheader>
          <Link to="/browse">
            <ListItem button>
              <ListItemText>{Translated.byKey("browse")}</ListItemText>
            </ListItem>
          </Link>
          {showManageClub() && (
            <Link to="/club/manage">
              <ListItem button>
                <ListItemText>{Translated.byKey("manageClub")}</ListItemText>
              </ListItem>
            </Link>
          )}
          {showManageOrganization() && (
            <Link to="/organization/manage">
              <ListItem button>
                <ListItemText>
                  {Translated.byKey("manageOrganization")}
                </ListItemText>
              </ListItem>
            </Link>
          )}
        </div>

        {showAccountCreation() && (
          <div>
            <>
              <ListSubheader>
                {Translated.byKey("navbarAccountCreation")}
              </ListSubheader>
              <Link to="/account/create">
                <ListItem button>
                  <ListItemText>
                    {Translated.byKey("createAccounts")}
                  </ListItemText>
                </ListItem>
              </Link>
              <Link to="/registration/generate/invitation">
                <ListItem button>
                  <ListItemText>{Translated.byKey("invite")}</ListItemText>
                </ListItem>
              </Link>
              {isAdmin() && (
                <Link to="/registration/organization">
                  <ListItem button>
                    <ListItemText>
                      {Translated.byKey("createOrganization")}
                    </ListItemText>
                  </ListItem>
                </Link>
              )}
            </>
          </div>
        )}

        <div>
          <ListSubheader>{Translated.byKey("navbarInfo")}</ListSubheader>
          <Link to="/about">
            <ListItem button>
              <ListItemText>{Translated.byKey("about")}</ListItemText>
            </ListItem>
          </Link>
          <Link to="/user-guide">
            <ListItem button>
              <ListItemText>{Translated.byKey("userGuide")}</ListItemText>
            </ListItem>
          </Link>
          <Link to="/contact">
            <ListItem button>
              <ListItemText>{Translated.byKey("contact")}</ListItemText>
            </ListItem>
          </Link>
        </div>
      </List>
    </>
  );
});

export { Links, MobileLinks };
