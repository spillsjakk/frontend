import React, { Component, SyntheticEvent, FormEvent, RefObject } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchCall, fetchJson, title } from "../../functions";
import { RouteComponentProps, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
  SearchMatchProps,
} from "react-bootstrap-table2-toolkit";
import UserLink from "../../components/UserLink";
import { Tab, Nav, Button } from "react-bootstrap";
import Chess from "chess.js";
import { UserContext } from "../../components/UserContext";
import {
  Tournament,
  Participant,
  TeamParticipant,
  Pairing,
  Team,
  LightGame,
  TKOSeparation,
} from "./Types";

import "./Manage.scss";
import { Timestamp } from "../../components/Timestamp";
import FederationDisplay from "../../components/FederationDisplay";
import { Countdown } from "../../components/count-down/index";
import { ManageRoundsAndPairings } from "../../containers/manage-rounds-and-pairings/index";
import { SetupRoundButton } from "../../containers/setup-round-button/index";
import { TournamentProvider } from "../../context/tournament";
import { TournamentParticipantsProvider } from "../../context/tournament-participants";
import { WithTournamentRound } from "../../hocs/tournament-round";
import { WithTournamentPairing } from "../../hocs/tournament-pairing";
import { WithRoundSetupPopup } from "../../hocs/with-round-setup-popup";
import { HelpBox, helpboxNames } from "../../components/help-box";
import { GameOutcome } from "../Game/play";
import { numToSquare } from "../Game/play/clock";
import { DRAW_OFFER_SIGN } from "../../constants";

const { SearchBar } = Search;

function ChangeTime(props: { white: boolean; add: boolean; id: string }) {
  return (
    <button
      className="btn-primary"
      style={{ margin: "5px 10px" }}
      onClick={() => {
        fetchCall(
          `/s/game/time/${props.id}`,
          "POST",
          {
            white: props.white,
            add: props.add,
          },
          () => {}
        );
      }}
    >
      {props.white ? "w " : "b "}
      {props.add ? "60s+" : "60s-"}
    </button>
  );
}

type FullTournamentInfo = {
  tournament: Tournament;
  participants: Participant[];
  pairings: Pairing[];
  teams: TeamParticipant[];
  is_team_tournament: boolean;
  managed_teams?: Team[];
  can_start: boolean;
  games: { [id: string]: LightGame[] };
  tko_separation?: { [id: string]: TKOSeparation };
  self_join_teams?: Team[];
  is_participating: boolean;
  organiser_name: string;
  ssw?: string[];
};

type TournamentState = {
  loaded: boolean;
  info?: FullTournamentInfo;
};

type TournamentParams = {
  tid: string;
};

function headerFormatter(column: any, _: any, components: any) {
  return (
    <>
      {Translated.byKey(column.text)}
      {components.sortElement}
    </>
  );
}

function outcomeToStr(outcome: number | undefined) {
  switch (outcome) {
    case 1:
      return "1-0";
    case 0:
      return "½-½";
    case -1:
      return "0-1";
    default:
      return "*";
  }
}

class View extends Component<
  RouteComponentProps<TournamentParams>,
  TournamentState
> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;
  pairingDateRef: RefObject<HTMLInputElement>;
  pairingHourRef: RefObject<HTMLInputElement>;

  participantColumns: any[];
  teamParticipantColumns: any[];
  sswColumn: any;
  tbColumns: any[];

  constructor(props: RouteComponentProps<TournamentParams>) {
    super(props);

    this.state = {
      loaded: false,
    };

    this.pairingDateRef = React.createRef();
    this.pairingHourRef = React.createRef();

    this.onClickResult = this.onClickResult.bind(this);
    this.onPressStart = this.onPressStart.bind(this);
    this.onChangeOnline = this.onChangeOnline.bind(this);
    this.onUpdatePairingTime = this.onUpdatePairingTime.bind(this);
    this.loadState = this.loadState.bind(this);
    this.onDeleteTournament = this.onDeleteTournament.bind(this);
    this.downloadPgn = this.downloadPgn.bind(this);

    this.participantColumns = [
      { dataField: "seed", text: "seed", sort: true, headerFormatter },
      {
        dataField: "account",
        sort: true,
        text: "player",
        headerFormatter,
        formatter: function (_: any, row: Participant, __: any, ___: any) {
          const participantLink = (
            <UserLink
              id={row.account}
              name={row.first_name + " " + row.last_name}
              ghost={row.ghost ?? true}
            />
          );
          const titleSpan = row.title ? (
            <span className="title">{row.title}</span>
          ) : (
            <></>
          );
          if (row.eliminated) {
            return (
              <s>
                {titleSpan} {participantLink}
              </s>
            );
          } else {
            return (
              <>
                {titleSpan} {participantLink}
              </>
            );
          }
        },
      },
      {
        dataField: "team_name",
        sort: true,
        text: "team",
        headerFormatter,
        formatter: function (_: any, row: Participant, __: any, ___: any) {
          return row.team ? (
            <Link to={"/team/view/" + row.team}>{row.team_name}</Link>
          ) : (
            <></>
          );
        },
      },
      { dataField: "fide_rating", text: "rating", sort: true, headerFormatter },
      {
        dataField: "federation",
        text: "federation",
        sort: true,
        headerFormatter,
        formatter: function (_: any, row: Participant, __: any, ___: any) {
          return <FederationDisplay value={row.federation} />;
        },
      },
      {
        dataField: "score",
        text: "score",
        sort: true,
        headerFormatter,
        formatter: (function (v: View) {
          return function (
            _: any,
            row: Participant,
            rowIndex: number,
            ___: any
          ) {
            if (v.state.info?.tournament?.show_only_top_nr) {
              if (rowIndex >= v.state.info!.tournament.show_only_top_nr!) {
                return "";
              } else {
                return row.score.toString();
              }
            } else {
              return row.score.toString();
            }
          };
        })(this),
      },
    ];

    this.teamParticipantColumns = [
      { dataField: "seed", text: "seed", sort: true, headerFormatter },
      {
        dataField: "name",
        text: "team",
        sort: true,
        headerFormatter,
        formatter: function (_: any, row: TeamParticipant, __: any, ___: any) {
          if (!row.eliminated) {
            return <Link to={"/team/view/" + row.team_id}>{row.name}</Link>;
          } else {
            return (
              <s>
                <Link to={"/team/view/" + row.team_id}>{row.name}</Link>
              </s>
            );
          }
        },
      },
      {
        dataField: "match_score",
        text: "matchScore",
        sort: true,
        headerFormatter,
        formatter: (function (v: View) {
          return function (
            _: any,
            row: TeamParticipant,
            rowIndex: number,
            ___: any
          ) {
            if (v.state.info?.tournament?.show_only_top_nr) {
              if (rowIndex >= v.state.info!.tournament.show_only_top_nr!) {
                return "";
              } else {
                return row.match_score.toString();
              }
            } else {
              return row.match_score.toString();
            }
          };
        })(this),
      },
      {
        dataField: "game_score",
        text: "gameScore",
        sort: true,
        headerFormatter,
        formatter: (function (v: View) {
          return function (
            _: any,
            row: TeamParticipant,
            rowIndex: number,
            ___: any
          ) {
            if (v.state.info?.tournament?.show_only_top_nr) {
              if (rowIndex >= v.state.info!.tournament.show_only_top_nr!) {
                return "";
              } else {
                return row.game_score.toString();
              }
            } else {
              return row.game_score.toString();
            }
          };
        })(this),
      },
    ];

    const sswFormatter = (function (v: View) {
      return function (_: any, __: any, rowIndex: number, ___: any) {
        return v.state.info?.ssw?.[rowIndex];
      };
    })(this);

    this.sswColumn = {
      dataField: "none",
      isDummyField: true,
      text: "weighted",
      headerFormatter,
      formatter: sswFormatter,
    };

    this.tbColumns = [
      { dataField: "tb1", text: "TB1", sort: true },
      { dataField: "tb2", text: "TB2", sort: true },
      { dataField: "tb3", text: "TB3", sort: true },
      { dataField: "tb4", text: "TB4", sort: true },
    ];
  }

  onParticipantsColumnMatch({
    searchText,
    value,
    column,
    row,
  }: SearchMatchProps<any>) {
    return (
      (value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchText)) ||
      (row.first_name + " " + row.last_name).toLowerCase().includes(searchText)
    );
  }

  async onDeleteTournament() {
    if (window.confirm(Translated.byKey("confirmTournamentDeletion"))) {
      fetchJson(
        "/s/tournament/" + this.state.info?.tournament.id,
        "DELETE",
        undefined,
        () => {
          window.location.replace("/");
        }
      );
    }
  }

  loadState() {
    fetchJson(
      "/s/tournament/view/" + this.props.match.params.tid,
      "GET",
      undefined,
      (json) => {
        this.setState({ loaded: true, info: json });
      }
    );
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Tournament-View";

    this.loadState();
  }

  onClickResult(e: SyntheticEvent<EventTarget>) {
    e.preventDefault();

    if (!(e.target instanceof HTMLAnchorElement)) {
      return;
    }

    const round = e.target.dataset.round;
    const white = e.target.dataset.white;
    const black = e.target.dataset.black;
    const gameResult = e.target.dataset.result;
    fetchJson(
      `/s/tournament/set-result/${this.props.match.params.tid}/${round}/${white}/${black}/${gameResult}`,
      "POST",
      undefined,
      (json) => {
        if (json.ok) {
          this.loadState();
        }
      }
    );
  }

  onChangeOnline(e: SyntheticEvent<EventTarget>) {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    const round = e.target.dataset.round;
    const white = e.target.dataset.white;
    const black = e.target.dataset.black;
    const checkedBool = e.target.checked;
    const checked = checkedBool.toString();
    fetchJson(
      `/s/tournament/set-online/${this.props.match.params.tid}/${round}/${white}/${black}/${checked}`,
      "POST",
      undefined,
      (_) => {
        const pairings = this.state.info!.pairings;
        for (const p of pairings) {
          if (
            p.round.toString() === round &&
            p.white === white &&
            p.black === black
          ) {
            p.online = checkedBool;
            break;
          }
        }
        const info = { ...this.state.info! };
        info.pairings = pairings;
        this.setState({ info });
      }
    );
  }

  onPressStart() {
    fetchJson(
      `/s/tournament/start/${this.props.match.params.tid}`,
      "POST",
      undefined,
      this.loadState
    );
  }

  onUpdatePairingTime(e: FormEvent) {
    e.preventDefault();

    const date = this.pairingDateRef.current?.value;
    const time = this.pairingHourRef.current?.value;

    const pairingDateTime = new Date(date + "T" + time);
    const pairingDateIsoParts = pairingDateTime.toISOString().split("T");
    const dateUtc = pairingDateIsoParts[0];
    const timeUtc = pairingDateIsoParts[1].substr(0, 5);

    fetchJson(
      `/s/tournament/change-online-pairing/${this.props.match.params.tid}`,
      "POST",
      {
        next_pairing_date: dateUtc,
        next_pairing_time: timeUtc,
      },
      this.loadState
    );
  }

  reconstructGame(moves: Array<number>) {
    const game = new Chess();
    for (let i = 0; i < moves.length; i += 3) {
      if (moves[i] === 97) {
        // draw offer
        game.set_comment(DRAW_OFFER_SIGN);
        continue;
      }
      const from = numToSquare(moves[i]);
      const to = numToSquare(moves[i + 1]);
      let prom: string | null = "-nbrq"[moves[i + 2]];
      if (prom === "-") {
        prom = null;
      }
      game.move({ from: from, to: to, promotion: prom });
    }

    return game;
  }

  getPgn(name: string, start, round, white, black, outcome, moves) {
    const game = this.reconstructGame(moves);
    return `[Event "${name}"]\n[Site "spillsjakk.no"]\n[Date "${start}"]\n[round "${round}"]\n[White "${white}"]\n[Black "${black}"]\n[Result "${
      outcome !== GameOutcome.Ongoing &&
      (outcome === GameOutcome.WhiteWins
        ? "1-0"
        : outcome === GameOutcome.BlackWins
        ? "0-1"
        : "1/2-1/2")
    }"]\n\n${game.pgn()}\n\n
    `;
  }

  downloadPgn() {
    fetchJson(
      `/s/tournament/games/${this.state.info.tournament.id}`,
      "GET",
      undefined,
      (result) => {
        if (result && Array.isArray(result.games)) {
          const element = document.createElement("a");
          element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," +
              encodeURIComponent(
                result.games.reduce((acc, val) => {
                  const pgn = `${this.getPgn(
                    result.name,
                    val.start,
                    val.round,
                    val.white_name,
                    val.black_name,
                    val.outcome,
                    val.moves
                  )}`;
                  if (acc) {
                    return `${acc}\n${pgn}`;
                  } else {
                    return pgn;
                  }
                }, false)
              )
          );
          element.setAttribute(
            "download",
            `${this.state.info.tournament.id}.pgn`
          );

          element.style.display = "none";
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
        }
      }
    );
  }

  render() {
    if (!this.state.loaded) {
      return <p>Loading...</p>;
    }

    const info: FullTournamentInfo = this.state.info!;

    const pairingTabLinks = [];
    const pairingRows: any[][] = [];
    for (const pairing of info.pairings) {
      if (pairing.round > pairingTabLinks.length) {
        pairingTabLinks.push(
          <Nav.Item key={pairing.round}>
            <Nav.Link eventKey={"round-tab-" + pairing.round.toString()}>
              <Translated str="round" />
              &nbsp;{pairing.round}
            </Nav.Link>
          </Nav.Item>
        );
        pairingRows.push([]);
      }

      if (pairing.white === "bye" || pairing.black === "bye") {
        continue;
      }

      const whiteCell = (
        <td>
          {pairing.white_title && (
            <>
              <span className="title">{pairing.white_title}</span>&nbsp;
            </>
          )}
          {pairing.white_name}
        </td>
      );

      const outcomeCell = (
        <td>
          {info.tournament.kind !== "TeamKnockout"
            ? outcomeToStr(pairing.outcome)
            : outcomeToStr(
                info.tko_separation?.[
                  pairing.round.toString() + "_" + pairing.white
                ].game1
              )}
        </td>
      );

      const blackCell = (
        <td>
          {pairing.black_title && (
            <>
              <span className="title">{pairing.black_title}</span>&nbsp;
            </>
          )}
          {pairing.black_name}
        </td>
      );

      const organizerCells = (
        <>
          {this.context.user.authenticated && (
            <>
              <td>
                <a
                  href="#"
                  data-result={1}
                  data-white={pairing.white}
                  data-black={pairing.black}
                  data-round={pairing.round}
                  onClick={this.onClickResult}
                >
                  1-0
                </a>
              </td>
              {info.tournament.kind !== "Knockout" && (
                <td>
                  <a
                    href="#"
                    data-result={0}
                    data-white={pairing.white}
                    data-black={pairing.black}
                    data-round={pairing.round}
                    onClick={this.onClickResult}
                  >
                    &#189;-&#189;
                  </a>
                </td>
              )}
              <td>
                <a
                  href="#"
                  data-result={-1}
                  data-white={pairing.white}
                  data-black={pairing.black}
                  data-round={pairing.round}
                  onClick={this.onClickResult}
                >
                  0-1
                </a>
              </td>
            </>
          )}
        </>
      );

      const onlineCell = (
        <td rowSpan={info.tournament.kind === "TeamKnockout" ? 2 : 1}>
          <input
            data-white={pairing.white}
            data-black={pairing.black}
            data-round={pairing.round}
            type="checkbox"
            className="chk-online"
            checked={pairing.online}
            onChange={this.onChangeOnline}
            disabled={!this.context.user.authenticated}
          />
        </td>
      );

      const games =
        info.games[
          pairing.round.toString() + "_" + pairing.white + "_" + pairing.black
        ] ||
        info.games[
          pairing.round.toString() + "_" + pairing.black + "_" + pairing.white
        ] ||
        [];
      const sortedGames = games.sort((a, b) =>
        a.start > b.start ? 1 : a.start === b.start ? 0 : -1
      );

      const gameLinkCell = (
        <td rowSpan={info.tournament.kind === "TeamKnockout" ? 2 : 1}>
          {sortedGames.map((g) => (
            <div key={g.id}>
              <ChangeTime white={true} add={true} id={g.id} />
              <ChangeTime white={true} add={false} id={g.id} />
              <Link to={"/game/play/" + g.id}>
                <Translated str={g.finished ? "finished" : "ongoing"} />
              </Link>
              <ChangeTime white={false} add={true} id={g.id} />
              <ChangeTime white={false} add={false} id={g.id} />
            </div>
          ))}
        </td>
      );

      if (pairingRows[pairing.round - 1]) {
        pairingRows[pairing.round - 1].push(
          <tr key={pairing.white + "_" + pairing.black}>
            {whiteCell}
            {outcomeCell}
            {blackCell}
            {organizerCells}
            {onlineCell}
            {gameLinkCell}
          </tr>
        );
      }

      if (info.tournament.kind === "TeamKnockout") {
        const outcomeCell2 = (
          <td>
            {outcomeToStr(
              info.tko_separation?.[
                pairing.round.toString() + "_" + pairing.white
              ].game2
            )}
          </td>
        );
        const organizerCells2 = (
          <>
            {this.context.user.authenticated && (
              <>
                <td>
                  <a
                    href="#"
                    data-result={1}
                    data-white={pairing.black}
                    data-black={pairing.white}
                    data-round={pairing.round}
                    onClick={this.onClickResult}
                  >
                    1-0
                  </a>
                </td>
                <td>
                  <a
                    href="#"
                    data-result={0}
                    data-white={pairing.black}
                    data-black={pairing.white}
                    data-round={pairing.round}
                    onClick={this.onClickResult}
                  >
                    &#189;-&#189;
                  </a>
                </td>
                <td>
                  <a
                    href="#"
                    data-result={-1}
                    data-white={pairing.black}
                    data-black={pairing.white}
                    data-round={pairing.round}
                    onClick={this.onClickResult}
                  >
                    0-1
                  </a>
                </td>
              </>
            )}
          </>
        );

        if (pairingRows[pairing.round - 1]) {
          pairingRows[pairing.round - 1].push(
            <tr key={"-" + pairing.white + "_" + pairing.black}>
              {blackCell}
              {outcomeCell2}
              {whiteCell}
              {organizerCells2}
            </tr>
          );
        }
      }
    }

    const pairingNav = <Nav className="nav-tabs">{pairingTabLinks}</Nav>;

    const pairingPanes = pairingRows.map((r, i) => {
      return (
        <Tab.Pane eventKey={"round-tab-" + (i + 1).toString()} key={i}>
          {this.context.user.authenticated && (
            <div className="mt-4">
              {(this.state.info?.tournament.kind === "RoundRobin" ||
                this.state.info?.tournament.kind === "TeamRoundRobin") && (
                <SetupRoundButton roundNumber={i + 1} />
              )}
              <a
                href={
                  "/s/tournament/printout/boardcards/" +
                  info.tournament.id +
                  "/" +
                  (i + 1).toString()
                }
              >
                <Translated str="boardCards" />
              </a>
            </div>
          )}
          <table className="table table-striped mt-4 dense pairing-table">
            <thead>
              <tr>
                <th>
                  <Translated str="player" />
                </th>
                <th>
                  <Translated str="result" />
                </th>
                <th>
                  <Translated str="player" />
                </th>
                {this.context.user.authenticated && (
                  <>
                    <th></th>
                    {info.tournament.kind !== "Knockout" && <th></th>}
                    <th></th>
                  </>
                )}
                <th>
                  <Translated str="online" />?
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>{r}</tbody>
          </table>
        </Tab.Pane>
      );
    });

    return (
      <TournamentProvider value={{ tournament: this.state.info?.tournament }}>
        <TournamentParticipantsProvider
          value={{ participants: this.state.info?.participants || [] }}
        >
          <WithTournamentRound>
            <WithTournamentPairing>
              <WithRoundSetupPopup>
                <Helmet>
                  <title>
                    {title(this.state.info?.tournament.name || "tournament")}
                  </title>
                </Helmet>

                <h1 className="mt-4 p-3">{this.state.info?.tournament.name}</h1>

                <p
                  className="mt-4"
                  id="description"
                  style={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{
                    __html: this.state.info?.tournament.description || "",
                  }}
                ></p>

                {this.context.user.authenticated && (
                  <form>
                    {!info.tournament.started && (
                      <>
                        <Button
                          variant="primary"
                          className="p-3 mb-3"
                          disabled={false}
                          onClick={this.onPressStart}
                        >
                          <Translated str="start" />
                        </Button>
                        <HelpBox
                          placement="bottom"
                          name={helpboxNames.manageTournamentManageParticipants}
                          text={Translated.byKey(
                            "manageTournamentManageParticipantsHelpbox"
                          )}
                          show={true}
                        >
                          <Link
                            className="p-3 btn btn-primary ml-5 mb-3"
                            to={"/tournament/players/" + info.tournament.id}
                          >
                            <Translated str="manageParticipants" />
                          </Link>
                        </HelpBox>
                      </>
                    )}
                    {info.managed_teams &&
                      info.managed_teams?.map((t) => (
                        <Link
                          key={t.id}
                          className="p-3 btn btn-primary ml-5 mb-3"
                          to={
                            "/tournament/manage-team/" +
                            info.tournament.id +
                            "/" +
                            t.id
                          }
                        >
                          <Translated str="manage" /> &quot;{t.name}&quot;
                        </Link>
                      ))}
                    <Link
                      className={`p-3 ml-3 btn btn-primary ${
                        info.pairings.length === 0 ? "ml-5" : ""
                      } mb-3`}
                      to={"/tournament/edit/" + info.tournament.id}
                    >
                      <Translated str="editTournament" />
                    </Link>
                    <div
                      className="p-3 btn btn-danger ml-5 mb-3"
                      onClick={() => this.onDeleteTournament()}
                    >
                      <Translated str="deleteTournament" />
                    </div>
                  </form>
                )}

                {this.context.user.authenticated && (
                  <div className="mt-4">
                    <a
                      href={
                        "/s/tournament/printout/results/" + info.tournament.id
                      }
                    >
                      <Translated str="resultPrintouts" />
                    </a>
                    &nbsp;|&nbsp;
                    <a
                      href={
                        "/s/tournament/printout/pairings/" + info.tournament.id
                      }
                    >
                      <Translated str="pairingPrintouts" />
                    </a>
                  </div>
                )}

                {info.tournament.kind !== "ManualPairing" &&
                  info.tournament.kind !== "RoundRobin" && (
                    <div className="mt-5">
                      <Countdown
                        time={info.tournament.current_online_pairing_time}
                      />
                      <Translated str="nextOnlinePairingWillBeAt" />:{" "}
                      <Timestamp
                        time={info.tournament.current_online_pairing_time}
                      />
                      {this.context.user.authenticated && (
                        <form onSubmit={this.onUpdatePairingTime}>
                          <HelpBox
                            placement="bottom"
                            name={helpboxNames.manageTournamentChangeTime}
                            text={Translated.byKey(
                              "manageTournamentChangeTimeHelpbox"
                            )}
                            show={true}
                          >
                            <label htmlFor="next_pairing_date">
                              <Translated str="changeNextPairingDateTime" />{" "}
                              (hh:mm, <Translated str="localTime" />
                              !):
                            </label>
                          </HelpBox>
                          <input
                            ref={this.pairingDateRef}
                            type="date"
                            id="next_pairing_date"
                            className="form-control"
                            name="next_pairing_date"
                            style={{ display: "inline", width: "13%" }}
                            required
                            min="2000-01-01"
                            max="2099-12-31"
                          />
                          <input
                            ref={this.pairingHourRef}
                            type="input"
                            className="form-control"
                            name="next_pairing_time"
                            style={{ display: "inline", width: "13%" }}
                            required
                            pattern="\d\d?:\d\d"
                          />
                          <button
                            className="p-2 btn btn-primary mb-1"
                            type="submit"
                          >
                            <Translated str="update" />
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                <div className="d-flex flex-row mt-5 justify-content-around">
                  <div>
                    <img
                      src="/icons/bullseye.svg"
                      alt=""
                      width="28"
                      height="28"
                      className="icon"
                    />
                    &nbsp;
                    <Translated
                      str={
                        info.tournament.kind.charAt(0).toLowerCase() +
                        info.tournament.kind.slice(1)
                      }
                    />
                    {info.tournament.rounds &&
                      info.tournament.kind !== "ManualPairing" && (
                        <>
                          &nbsp;- {info.tournament.rounds}&nbsp;
                          <Translated str="rounds" />
                        </>
                      )}
                  </div>
                  <div>
                    <img
                      src="/icons/calendar.svg"
                      alt=""
                      width="28"
                      height="28"
                      className="icon"
                    />
                    &nbsp;
                    {info.tournament.start_date} - {info.tournament.end_date}
                  </div>
                  <div>
                    <img
                      src="/icons/person.svg"
                      alt=""
                      width="28"
                      height="28"
                      className="icon"
                    />
                    &nbsp;
                    <UserLink
                      id={info.tournament.organizer}
                      name={info.tournament.organizer}
                      ghost={false}
                    />
                  </div>
                </div>

                {this.state.info?.tournament?.kind === "ManualPairing" &&
                  this.context.user.authenticated && (
                    <ManageRoundsAndPairings />
                  )}
                <HelpBox
                  placement="top"
                  name={helpboxNames.manageTournamentStandings}
                  text={Translated.byKey("manageTournamentStandingsHelpbox")}
                  show={true}
                >
                  <h3 className="mt-5 mb-4">
                    <Translated str="standings" />
                  </h3>
                </HelpBox>

                <Tab.Container defaultActiveKey="standings-i-tab">
                  <Nav className="nav-tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="standings-i-tab">
                        <Translated str="individual" />
                      </Nav.Link>
                    </Nav.Item>
                    {info.is_team_tournament && (
                      <Nav.Item>
                        <Nav.Link eventKey="standings-t-tab">
                          <Translated str="team" />
                        </Nav.Link>
                      </Nav.Item>
                    )}
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="standings-i-tab">
                      <ToolkitProvider
                        keyField="account"
                        data={info.participants}
                        columns={
                          info.tournament.kind === "SwissDutch"
                            ? this.participantColumns.concat(this.tbColumns)
                            : this.participantColumns
                        }
                        bootstrap4={true}
                        search={{
                          onColumnMatch: this.onParticipantsColumnMatch,
                        }}
                      >
                        {(props) => (
                          <>
                            <SearchBar {...props.searchProps} />
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory({})}
                            />
                          </>
                        )}
                      </ToolkitProvider>
                    </Tab.Pane>

                    {info.is_team_tournament && (
                      <Tab.Pane eventKey="standings-t-tab">
                        <ToolkitProvider
                          keyField="team_id"
                          data={info.teams}
                          columns={
                            info.ssw
                              ? this.teamParticipantColumns.concat([
                                  this.sswColumn,
                                ])
                              : this.teamParticipantColumns
                          }
                          bootstrap4={true}
                          search
                        >
                          {(props) => (
                            <>
                              <SearchBar {...props.searchProps} />
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory({})}
                              />
                            </>
                          )}
                        </ToolkitProvider>
                      </Tab.Pane>
                    )}
                  </Tab.Content>
                </Tab.Container>

                {info.pairings.length !== 0 && (
                  <>
                    <div className="pairing-heading">
                      <h3 className="mt-4">
                        <Translated str="pairings" />
                      </h3>
                      <Button
                        className="download"
                        variant="primary"
                        onClick={this.downloadPgn}
                      >
                        {Translated.byKey("downloadPgns")}
                      </Button>
                    </div>
                    <Tab.Container
                      defaultActiveKey={
                        "round-tab-" + pairingPanes.length.toString()
                      }
                    >
                      {pairingNav}
                      <Tab.Content>{pairingPanes}</Tab.Content>
                    </Tab.Container>
                  </>
                )}
              </WithRoundSetupPopup>
            </WithTournamentPairing>
          </WithTournamentRound>
        </TournamentParticipantsProvider>
      </TournamentProvider>
    );
  }
}

export default View;
