import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from "react-router-dom";
import { fetchJson } from "../../functions";

type LobbyState = {
  interval?: number
}

class Lobby extends Component<RouteComponentProps, LobbyState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = { };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-Lobby";

    fetchJson(`/s/game/lobby`, "GET", undefined, json => {
      if (json.next === 0) {
        this.props.history.push("/game/play/" + json.id);
      }
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Lobby</title>
        </Helmet>
        
      </>
    );
  }
}

export default Lobby;