import React, { Component, FormEvent } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";

import Translated from "../../components/translated";
import LangSwitcher from "../../components/LangSwitcher";
import InboxLink from "../../components/InboxLink";
import { UserContext, Levels } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { Logo } from "./logo";

class NavigationBar extends Component {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: {}) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  doLogout(event: FormEvent) {
    event.preventDefault();

    fetchJson("/s/account/logout", "POST", {}, (_) => {
      this.context.setUser({ authenticated: false });
    });
  }

  render() {
    return (
      <Navbar expand="lg" id="navigation-bar">
        <Navbar.Brand as={Link} to="/">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="collapsible-navbar" />
        <Navbar.Collapse id="collapsible-navbar">
          <Nav className="mr-auto"></Nav>
          <Nav className="mr-1">
            <LangSwitcher />
            {this.context.user.authenticated &&
              (this.context.user.info?.level || 0) > 0 && (
                <Dropdown>
                  <Dropdown.Toggle style={{ marginTop: "3px" }}>
                    <Translated str="manage" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/account/create">
                      <Translated str="createAccounts" />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/tournament/build">
                      <Translated str="buildTournament" />
                    </Dropdown.Item>
                    {this.context.user.info?.level !==
                      Levels.OrganizationManager && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/club/manage">
                          <Translated str="manageClub" />
                        </Dropdown.Item>
                      </>
                    )}
                    {(this.context.user.info?.level || 0) >=
                      Levels.OrganizationManager && (
                      <>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item as={Link} to="/organization/manage">
                          <Translated str="manageOrganization" />
                        </Dropdown.Item>
                        {this.context.user.info?.level === Levels.Admin && (
                          <>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item as={Link} to="/account/csv_import">
                              CSV account import
                            </Dropdown.Item>
                          </>
                        )}
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            <Nav.Link as={Link} to="/contact">
              <img
                src="/icons/envelope.svg"
                alt=""
                width="32"
                height="32"
                className="icon"
              />
              &nbsp;
              <span className="black-text">
                <Translated str="contact" />
              </span>
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <img
                src="/icons/info.svg"
                alt=""
                width="32"
                height="32"
                className="icon"
              />
              &nbsp;
              <span className="black-text">
                <Translated str="about" />
              </span>
            </Nav.Link>
            {!this.context.user.authenticated ? (
              <Nav.Link
                as={Link}
                to={{ pathname: "/login", state: { canGoBack: true } }}
              >
                <img
                  src="/icons/person.svg"
                  alt=""
                  width="32"
                  height="32"
                  className="icon"
                />
                &nbsp;
                <span className="black-text">
                  <Translated str="login" />
                </span>
              </Nav.Link>
            ) : (
              <>
                <InboxLink />
                <Nav.Link
                  as={Link}
                  to={"/profile/" + this.context.user.info?.id}
                >
                  <img
                    src="/icons/person.svg"
                    alt=""
                    width="32"
                    height="32"
                    className="icon"
                  />
                  &nbsp;
                  <span className="black-text">
                    {this.context.user.info?.name}
                  </span>
                </Nav.Link>
                <Nav.Item>
                  <form className="form-inline" onSubmit={this.doLogout}>
                    <button
                      className="btn nav-link"
                      style={{
                        border: 0,
                        marginTop: "0.22rem",
                        transition: "none",
                      }}
                      type="submit"
                    >
                      <span className="black-text">
                        <Translated str="logout" />
                      </span>
                    </button>
                  </form>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export { NavigationBar };
