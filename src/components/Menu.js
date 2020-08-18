import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";

import Translated from './Translated';

class Menu extends Component {
  render() {
    return (
      <Navbar expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src="/icons/logos/platform.png" id="logo" />&nbsp;
          Spill<b>Sjakk</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="collapsible-navbar" />
        <Navbar.Collapse id="collapsible-navbar">
          <Nav className="mr-auto"></Nav>
          <Nav className="mr-1">
          <Nav.Link as={Link} to="/contact">
            <img src="/icons/envelope.svg" alt="" width="32" height="32" class="icon" />&nbsp;
            <Translated str="contact" />
          </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Menu;