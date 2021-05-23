import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import LangSwitcher from "../../components/LangSwitcher";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { Logo } from "./logo";
import { HelpBox, helpboxNames } from "../../components/help-box";
import "./style.scss";
import { useMediaQuery } from "@material-ui/core";
import { MobileMenu } from "./mobile-menu";
import { Links } from "./links";

const NavigationBar: FunctionComponent<{}> = () => {
  const [hasMessage, setHasMessage] = useState(false);

  const { user, setUser } = useUser();
  const history = useHistory();
  const isTablet = useMediaQuery("(max-width:900px)");

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
              {isTablet && <MobileMenu />}
              <HelpBox
                placement="right"
                name={helpboxNames.logo}
                text={Translated.byKey("logoHelpbox")}
                show={authenticated()}
              >
                <Link to="/">
                  <Logo />
                </Link>
              </HelpBox>
              {!isTablet && <Links />}
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
