import React, { Component } from "react";
import { Container } from "react-bootstrap";

class LogoFooter extends Component {
  render() {
    return (
      <footer>
        <Container>
          <div className="d-flex flex-row justify-content-around">
            <div><a href="https://www.sjakk.no/nsf/" target="_blank" rel="noopener noreferrer"><img src="/icons/logos/NSF.png" className="nsf" /></a></div>
            <div><a href="https://www.skolesjakken.no/" target="_blank" rel="noopener noreferrer"><img src="/icons/logos/SkoleSjakken.png" /></a></div>
            <div><a href="https://www.sjakk.no/usf/" target="_blank" rel="noopener noreferrer"><img src="/icons/logos/USF.png" className="usf" /></a></div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default LogoFooter;