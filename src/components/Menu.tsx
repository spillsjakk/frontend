import React, { Component, FormEvent } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Dropdown } from "react-bootstrap";

import Translated from './Translated';
import LangSwitcher from './LangSwitcher';
import { UserContext } from "./UserContext";
import { fetchJson } from "../functions";

class Menu extends Component {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: {}) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  doLogout(event: FormEvent) {
    event.preventDefault();

    fetchJson("/s/account/logout", "POST", {}, _ => {
      this.context.setUser({ authenticated: false });
    });
  }

  render() {
    return (
      <Navbar expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src="/icons/logos/platform.png" id="logo" alt="logo" />&nbsp;
          Spill<b>Sjakk</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="collapsible-navbar" />
        <Navbar.Collapse id="collapsible-navbar">
          <Nav className="mr-auto"></Nav>
          <Nav className="mr-1">
            <LangSwitcher />
            {this.context.user.authenticated && (this.context.user.info?.level || 0) > 0 &&
              <Dropdown>
                <Dropdown.Toggle style={{ marginTop: "3px" }}>
                  <Translated str="manage" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/account/create">
                    <Translated str="createAccounts" />
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/team/create">
                    <Translated str="createATeam" />
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/team/mine">
                    <Translated str="myTeams" />
                  </Dropdown.Item>
                  {(this.context.user.info?.level || 0) > 1 && <>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/tournament/build">
                      <Translated str="buildTournament" />
                    </Dropdown.Item>
                    {this.context.user.info?.level === 4 && <>
                      <Dropdown.Divider></Dropdown.Divider>
                      <Dropdown.Item as={Link} to="/account/csv_import">
                        CSV account import
                      </Dropdown.Item>
                    </>}
                  </>}
                </Dropdown.Menu>
              </Dropdown>
            }
            <Nav.Link as={Link} to="/contact">
              <img src="/icons/envelope.svg" alt="" width="32" height="32" className="icon" />&nbsp;
              <Translated str="contact" />
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <img src="/icons/info.svg" alt="" width="32" height="32" className="icon" />&nbsp;
              <Translated str="about" />
            </Nav.Link>
            {!this.context.user.authenticated ?
              <Nav.Link as={Link} to={{ pathname: "/login", state: { canGoBack: true } }}>
                <img src="/icons/person.svg" alt="" width="32" height="32" className="icon" />&nbsp;
              <Translated str="login" />
              </Nav.Link> :
              <><Nav.Link as={Link} to={"/profile/" + this.context.user.info?.id}>
                <img src="/icons/person.svg" alt="" width="32" height="32" className="icon" />&nbsp;
                {this.context.user.info?.name}
              </Nav.Link>
                <Nav.Item>
                  <form className="form-inline" onSubmit={this.doLogout}>
                    <button className="btn nav-link" style={{ border: 0, marginTop: "0.22rem", transition: "none" }} type="submit"><Translated str="logout" /></button>
                  </form>
                </Nav.Item>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Menu;