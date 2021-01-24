import React, { FunctionComponent, useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { useTournamentDetail } from "../../context/tournament-detail";
import Translated from "../../components/translated";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import { defaultDate } from "../../constants";

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

const Pairings: FunctionComponent<{}> = () => {
  const [pairingPanes, setPairingPanes] = useState<any>([]);
  const [pairingNav, setPairingNav] = useState<any>([]);

  const {
    pairings,
    tournament,
    tko_separation,
    games,
    rounds,
  } = useTournamentDetail();

  useEffect(() => {
    if (Array.isArray(pairings) && pairings.length && tournament && games) {
      const pairingTabLinks = [];
      const pairingRows: any[][] = [];
      for (const pairing of pairings) {
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
            {tournament.show_only_usernames
              ? pairing.white_username
              : pairing.white_name}
          </td>
        );

        const outcomeCell = (
          <td>
            {tournament.kind !== "TeamKnockout"
              ? outcomeToStr(pairing.outcome)
              : outcomeToStr(
                  tko_separation?.[
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
            {tournament.show_only_usernames
              ? pairing.black_username
              : pairing.black_name}
          </td>
        );

        const onlineCell = (
          <td rowSpan={tournament.kind === "TeamKnockout" ? 2 : 1}>
            <input
              data-white={pairing.white}
              data-black={pairing.black}
              data-round={pairing.round}
              type="checkbox"
              className="chk-online"
              checked={pairing.online}
              disabled={true}
            />
          </td>
        );

        const localGames =
          games[
            pairing.round.toString() + "_" + pairing.white + "_" + pairing.black
          ] ||
          games[
            pairing.round.toString() + "_" + pairing.black + "_" + pairing.white
          ] ||
          [];
        const sortedGames = localGames.sort((a, b) =>
          a.start > b.start ? 1 : a.start === b.start ? 0 : -1
        );

        const gameLinkCell = (
          <td rowSpan={tournament.kind === "TeamKnockout" ? 2 : 1}>
            {sortedGames.map((g) => (
              <div key={g.id}>
                <Link to={"/game/play/" + g.id}>
                  <Translated str={g.finished ? "finished" : "ongoing"} />
                </Link>
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
              {onlineCell}
              {gameLinkCell}
            </tr>
          );
        }

        if (tournament.kind === "TeamKnockout") {
          const outcomeCell2 = (
            <td>
              {outcomeToStr(
                tko_separation?.[pairing.round.toString() + "_" + pairing.white]
                  .game2
              )}
            </td>
          );

          if (pairingRows[pairing.round - 1]) {
            pairingRows[pairing.round - 1].push(
              <tr key={"-" + pairing.white + "_" + pairing.black}>
                {blackCell}
                {outcomeCell2}
                {whiteCell}
              </tr>
            );
          }
        }
      }

      const pairingNav = <Nav className="nav-tabs">{pairingTabLinks}</Nav>;

      const pairingPanes = pairingRows.map((r, i) => {
        const round = rounds?.find((round) => round.number === i + 1);
        return (
          <Tab.Pane eventKey={"round-tab-" + (i + 1).toString()} key={i}>
            {round && round?.start_date !== defaultDate && (
              <div
                className={style["round-starting-time"]}
              >{`${Translated.byKey("startDate")}: ${new Date(
                round?.start_date || 0
              ).toLocaleString()}`}</div>
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
      setPairingNav(pairingNav);
      setPairingPanes(pairingPanes);
    }
  }, [pairings, tournament, tko_separation, games, rounds]);

  return (
    <>
      {Array.isArray(pairingPanes) && pairingPanes.length > 0 && (
        <div>
          <div className={style["centered-container"]}>
            <h3 className="mt-4">
              <Translated str="pairings" />
            </h3>
          </div>
          <Tab.Container
            defaultActiveKey={"round-tab-" + pairingPanes.length.toString()}
          >
            {pairingNav}
            <Tab.Content>{pairingPanes}</Tab.Content>
          </Tab.Container>
        </div>
      )}
    </>
  );
};
export { Pairings };
