import React, { FunctionComponent } from "react";
import Translated from "../../components/translated";
import { Logo } from "./logo";
import "./style.scss";

const NavigationBar: FunctionComponent<{}> = () => {
  return (
    <div id="navigation-bar">
      <div className="wrapper">
        <div className="left">
          <Logo />
          <div className="links">
            <div className="link">
              {Translated.byKey("navbarTournaments")}
              <div className="menu">
                <div className="item">My Tournament Calendar</div>
              </div>
            </div>
            <div className="link">
              {Translated.byKey("navbarOrgs")}
              <div className="menu">
                <div className="item">Browse</div>
                <div className="item">Create a New Club</div>
                <div className="item">Create a New Organisation</div>
              </div>
            </div>
            <div className="link">
              {Translated.byKey("navbarAccountCreation")}
              <div className="menu">
                <div className="item">Create an Account</div>
                <div className="item">Bulk Account Creation</div>
              </div>
            </div>
            <div className="link">
              {Translated.byKey("navbarInfo")}
              <div className="menu">
                <div className="item">About</div>
                <div className="item">User Guide</div>
                <div className="item">Contact</div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <button>{Translated.byKey("navbarLogin")}</button>
        </div>
      </div>
    </div>
  );
};

export { NavigationBar };
