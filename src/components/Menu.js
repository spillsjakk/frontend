import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";

class Menu extends Component {
  render() {
    return (
      <Navbar expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src="/icons/logos/platform.png" id="logo" />
          Spill<b>Sjakk</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="collapsible-navbar" />
        <Navbar.Collapse id="collapsible-navbar">
          <Nav className="mr-auto"></Nav>
          <Nav className="mr-1">
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Menu;