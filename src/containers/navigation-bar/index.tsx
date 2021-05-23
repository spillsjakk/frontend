import React, { FunctionComponent } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  MobileLangSwitcher,
  LangSwitcher,
} from "../../components/LangSwitcher";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { Logo } from "./logo";
import { HelpBox, helpboxNames } from "../../components/help-box";
import "./style.scss";
import { useMediaQuery } from "@material-ui/core";
import { MobileMenu } from "./mobile-menu";
import { Links } from "./links";
import { Actions, MobileActions } from "./actions";

const NavigationBar: FunctionComponent<{}> = () => {
  const { user } = useUser();
  const history = useHistory();
  const isTablet = useMediaQuery("(max-width:900px)");

  // required for rendering when route is changed
  useParams();

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
              {isTablet ? <MobileLangSwitcher /> : <LangSwitcher />}
              {anon() && (
                <a href="/login">
                  <button>{Translated.byKey("navbarLogin")}</button>
                </a>
              )}
              {authenticated() && (isTablet ? <MobileActions /> : <Actions />)}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export { NavigationBar };
