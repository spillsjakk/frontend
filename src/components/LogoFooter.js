import React, { Component } from "react";
import { Container } from "react-bootstrap";

class LogoFooter extends Component {
  render() {
    return (
      <footer>
        <Container>
          <div class="d-flex flex-row justify-content-around">
            <div><a href="https://www.sjakk.no/nsf/" target="_blank"><img src="/icons/logos/NSF.png" class="nsf" /></a></div>
            <div><a href="https://www.skolesjakken.no/" target="_blank"><img src="/icons/logos/SkoleSjakken.png" /></a></div>
            <div><a href="https://www.sjakk.no/usf/" target="_blank"><img src="/icons/logos/USF.png" class="usf" /></a></div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default LogoFooter;