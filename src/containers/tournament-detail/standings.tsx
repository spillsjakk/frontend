import React, { FunctionComponent, useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  SearchMatchProps,
} from "react-bootstrap-table2-toolkit";
import style from "./style.module.scss";
import Translated from "../../components/Translated";
import {} from "../../containers/tournament-detail";
import { useTournamentDetail } from "../../context/tournament-detail";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Participant, TeamParticipant } from "../../pages/Tournament/Types";
import { Link } from "react-router-dom";
import FederationDisplay from "../../components/FederationDisplay";
import UserLink from "../../components/UserLink";

const { SearchBar } = Search;

function headerFormatter(column: any, _: any, components: any) {
  return (
    <>
      {Translated.byKey(column.text)}
      {components.sortElement}
    </>
  );
}

function onParticipantsColumnMatch({
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

const tbColumns = [
  { dataField: "tb1", text: "TB1", sort: true },
  { dataField: "tb2", text: "TB2", sort: true },
  { dataField: "tb3", text: "TB3", sort: true },
  { dataField: "tb4", text: "TB4", sort: true },
];

const Standings: FunctionComponent<{}> = () => {
  const {
    tournament,
    ssw,
    is_team_tournament,
    participants,
    teams,
  } = useTournamentDetail();
  const [sswColumn, setSswColumn] = useState({});
  const [teamParticipantColumns, setTeamParticipantColumns] = useState<any[]>(
    []
  );
  const [participantColumns, setParticipantColumns] = useState<any[]>([]);

  function setup() {
    setSswColumn({
      dataField: "none",
      isDummyField: true,
      text: "weighted",
      headerFormatter,
      formatter: function (_: any, __: any, rowIndex: number, ___: any) {
        return ssw?.[rowIndex];
      },
    });

    setParticipantColumns([
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
          const titleSpan = row.title ? <span>{row.title}</span> : <></>;
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
        formatter: function f(_: any, row: Participant, __: any, ___: any) {
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
        formatter: function f(_: any, row: Participant, __: any, ___: any) {
          return <FederationDisplay value={row.federation} />;
        },
      },
      {
        dataField: "score",
        text: "score",
        sort: true,
        headerFormatter,
        formatter: function (
          _: any,
          row: Participant,
          rowIndex: number,
          ___: any
        ) {
          if (tournament?.show_only_top_nr) {
            if (rowIndex >= tournament.show_only_top_nr!) {
              return "";
            } else {
              return row.score.toString();
            }
          } else {
            return row.score.toString();
          }
        },
      },
    ]);

    setTeamParticipantColumns([
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
        formatter: function (
          _: any,
          row: TeamParticipant,
          rowIndex: number,
          ___: any
        ) {
          if (tournament?.show_only_top_nr) {
            if (rowIndex >= tournament.show_only_top_nr!) {
              return "";
            } else {
              return row.match_score.toString();
            }
          } else {
            return row.match_score.toString();
          }
        },
      },
      {
        dataField: "game_score",
        text: "gameScore",
        sort: true,
        headerFormatter,
        formatter: function (
          _: any,
          row: TeamParticipant,
          rowIndex: number,
          ___: any
        ) {
          if (tournament?.show_only_top_nr) {
            if (rowIndex >= tournament.show_only_top_nr!) {
              return "";
            } else {
              return row.game_score.toString();
            }
          } else {
            return row.game_score.toString();
          }
        },
      },
    ]);
  }

  useEffect(() => {
    setup();
  }, [tournament, ssw, participants]);

  return (
    <>
      {tournament && Array.isArray(participants) && participants.length > 0 && (
        <div className={style["standings-container"]}>
          <div className={style.table}>
            <div className={style["centered-container"]}>
              <h3 className="mt-4">
                <Translated str="standings" />
              </h3>
            </div>
            <Tab.Container defaultActiveKey="standings-i-tab">
              <Nav className="nav-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="standings-i-tab">
                    <Translated str="individual" />
                  </Nav.Link>
                </Nav.Item>
                {is_team_tournament && (
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
                    data={participants || []}
                    columns={
                      tournament?.kind === "SwissDutch"
                        ? participantColumns.concat(tbColumns as any)
                        : participantColumns
                    }
                    bootstrap4={true}
                    search={{ onColumnMatch: onParticipantsColumnMatch }}
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

                {is_team_tournament && (
                  <Tab.Pane eventKey="standings-t-tab">
                    <ToolkitProvider
                      keyField="team_id"
                      data={teams || []}
                      columns={
                        ssw
                          ? teamParticipantColumns.concat([sswColumn])
                          : teamParticipantColumns
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
          </div>
        </div>
      )}
    </>
  );
};
export { Standings };
