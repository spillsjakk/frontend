import React, { PureComponent } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchJson } from "../functions";
import Translated from "./translated";

type InboxLinkState = {
  hasUnread: boolean;
};

class InboxLink extends PureComponent<{}, InboxLinkState> {
  interval?: number;

  constructor(props: {}) {
    super(props);

    this.state = { hasUnread: false };

    this.updateState = this.updateState.bind(this);
    this.markReadForNow = this.markReadForNow.bind(this);
  }

  componentDidMount() {
    if (window.location.pathname !== "/inbox") {
      this.updateState();
    }

    this.interval = window.setInterval(this.updateState, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  updateState() {
    fetchJson(`/s/messages/has-unread`, "GET", undefined, (result) => {
      this.setState({ hasUnread: result.has });
    });
  }

  markReadForNow() {
    this.setState({ hasUnread: false });
  }

  render() {
    return (
      <Nav.Link as={Link} to="/inbox" onClick={this.markReadForNow}>
        <img
          src="/icons/bell.svg"
          alt=""
          width="32"
          height="32"
          className="icon"
        />
        &nbsp;
        <span
          style={
            this.state.hasUnread
              ? { color: "orangered", fontWeight: "bold" }
              : {}
          }
        >
          <span className="black-text">
            <Translated str="inbox" />
          </span>
        </span>
      </Nav.Link>
    );
  }
}

export default InboxLink;
