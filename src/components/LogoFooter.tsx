import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class LogoFooter extends Component {
  render() {
    return (
      <footer>
        <Container>
          <div className="d-flex flex-row justify-content-around">
            <div>
              <Link
                to="https://www.sjakk.no/nsf/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/logos/NSF.png" className="nsf" alt="NSF" />
              </Link>
            </div>
            <div>
              <Link
                to="https://www.skolesjakken.no/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/logos/SkoleSjakken.png" alt="SkoleSjakken" />
              </Link>
            </div>
            <div>
              <Link
                to="https://www.sjakk.no/usf/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/logos/USF.png" className="usf" alt="USF" />
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default LogoFooter;
