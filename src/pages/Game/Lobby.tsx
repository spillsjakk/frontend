import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from "react-router-dom";
import { fetchJson, title } from "../../functions";
import Translated from "../../components/Translated";
import UserLink from "../../components/UserLink";
import { UserContext } from "../../components/UserContext";
import { CircularProgressbar } from 'react-circular-progressbar';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import './chessground-theme.css';
import 'react-circular-progressbar/dist/styles.css';
import './Lobby.css';

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

type LobbyState = {
  next: number
  redirectAt?: Date
  id?: string
  info?: {
    opp_id: string
    opp_name: string
    orientation: string
    tournament: string
  }
  progress: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

class Lobby extends Component<RouteComponentProps, LobbyState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  tickInterval?: number;
  loadInterval?: number;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      next: -1,
      progress: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    };

    this.tick = this.tick.bind(this);
    this.load = this.load.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Game-Lobby";

    this.tickInterval = window.setInterval(this.tick, 250);

    this.loadInterval = window.setInterval(this.load, 45000);
    this.load();
  }

  componentWillUnmount() {
    window.clearInterval(this.tickInterval);
    window.clearInterval(this.loadInterval);
  }

  tick() {
    if (!this.state.redirectAt) {
      return;
    }

    const redirectAt = this.state.redirectAt!;

    if (new Date().getTime() > redirectAt.getTime()) {
      this.props.history.push("/game/play/" + this.state.id);
    } else {
      let left_now = Math.max(0, redirectAt.getTime() - new Date().getTime());
      let total_seconds = Math.ceil(left_now / 1000);
      let days_f = total_seconds / 86400;
      let days = Math.floor(days_f);
      let total_seconds_today = total_seconds % 86400;
      let hours_f = total_seconds_today / 3600;
      let hours = Math.floor(hours_f);
      let seconds_left = total_seconds_today % 3600;
      let minutes_f = seconds_left / 60;
      let minutes = Math.floor(minutes_f);
      let seconds = seconds_left % 60;
      this.setState({
        progress: {
          days,
          hours,
          minutes,
          seconds
        }
      });
    }
  }

  load() {
    fetchJson(`/s/game/lobby`, "GET", undefined, json => {
      if (json.authenticated === false) {
        this.props.history.push("/login?path=/game/lobby");
        return;
      }

      if (json.next === -1) {
        this.setState({
          next: -1,
          redirectAt: undefined,
          id: undefined,
          info: undefined
        });

        return;
      }

      if (json.next === 0) {
        this.props.history.push("/game/play/" + json.id);
        return;
      }

      let redirectAt = new Date();
      redirectAt.setTime(redirectAt.getTime() + json.next + 200);
      this.setState({
        next: json.next,
        redirectAt,
        id: json.id,
        info: json.info
      });
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("lobby")}</title>
        </Helmet>

        {this.state.next === -1 ? <>
          <h1 className="mt-5 p-3"><Translated str="waitingForGame" /></h1>

          <p className="mt-4">
            <Translated str="noUpcomingGames" />
          </p>
        </> : <>
            <div className="d-flex flex-row justify-content-between">

              <div>
                <h1 className="mt-5 p-3"><Translated str="waitingForGame" /></h1>

                <p className="mt-4">
                  <Translated str="nextGameIn" />
                </p>
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column circle-container">
                    <div id="circles-days">
                      <CircularProgressbar minValue={0} maxValue={365} value={this.state.progress.days} text={pad(this.state.progress.days)} />
                    </div>
                    <div className="circle-bottom"><Translated str="days" /></div>
                  </div>
                  <div className="d-flex flex-column circle-container">
                    <div id="circles-hours">
                      <CircularProgressbar minValue={0} maxValue={24} value={this.state.progress.hours} text={pad(this.state.progress.hours)} />
                    </div>
                    <div className="circle-bottom"><Translated str="hours" /></div>
                  </div>
                  <div className="d-flex flex-column circle-container">
                    <div id="circles-minutes">
                      <CircularProgressbar minValue={0} maxValue={60} value={this.state.progress.minutes} text={pad(this.state.progress.minutes)} />
                    </div>
                    <div className="circle-bottom"><Translated str="minutes" /></div>
                  </div>
                  <div className="d-flex flex-column circle-container">
                    <div id="circles-seconds">
                      <CircularProgressbar minValue={0} maxValue={365} value={this.state.progress.seconds} text={pad(this.state.progress.seconds)} />
                    </div>
                    <div className="circle-bottom"><Translated str="seconds" /></div>
                  </div>
                </div>
              </div>

              <div id="board-container">
                <div className="d-flex flex-row">
                  <div id="board">
                    <Chessground viewOnly={true} orientation={this.state.info!.orientation} width="375px" height="375px" />
                  </div>
                  <div className="d-flex flex-column justify-content-around names-container">
                    <div>
                      <UserLink id={this.state.info!.opp_id} name={this.state.info!.opp_name} ghost={false} />
                    </div>
                    <div>
                      <UserLink id={this.context.user.info?.id || ""} name={this.context.user.info?.name || ""} ghost={false} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <p>
              <a href={"/tournament/view/" + this.state.info!.tournament}><Translated str="backToTournament" /></a>
            </p>
          </>}
      </>
    );
  }
}

export default Lobby;