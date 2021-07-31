import React, { FunctionComponent, memo, useEffect, useState } from "react";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { useTournamentDetail } from "../../../context/tournament-detail";
import Translated from "../../../components/translated";
import { useOnlineStatus } from "../../../hocs/with-online-statuses";
import { Link } from "react-router-dom";
import { Online } from "./online";
import { Offline } from "./offline";
import style from "./style.module.scss";
import FederationDisplay from "../../../components/FederationDisplay";
import { fetchJson } from "../../../functions";

const commonFields = {
  headerClassName: style["table-header"],
  cellClassName: style["table-cell"],
  width: 120,
};

const ParticipantsTable: FunctionComponent<{ seen: boolean }> = ({ seen }) => {
  const { tournament, participants } = useTournamentDetail();
  const { onlineStatus } = useOnlineStatus();

  function getUsername(params) {
    return tournament?.show_only_usernames
      ? params.getValue(params.id, "username") || ""
      : `${params.getValue(params.id, "first_name")} ${params.getValue(
          params.id,
          "last_name"
        )}`;
  }

  function renderPlayerCell(params) {
    const participantLink = (
      <div className="text-truncate">
        <Link to={"/profile/" + params.id}>{getUsername(params)}</Link>
      </div>
    );
    const statusCircle = (
      <>
        {onlineStatus.find((obj) => obj.account === params.id)?.online ===
        true ? (
          <Online />
        ) : (
          <Offline />
        )}
      </>
    );
    const titleSpan = params.getValue(params.id, "title") ? (
      <div className={style["player-title"]}>
        {params.getValue(params.id, "title")}
      </div>
    ) : (
      <></>
    );
    const cell = (
      <div
        className="d-flex"
        style={{ lineHeight: "normal", maxWidth: "100%" }}
      >
        {statusCircle}
        {titleSpan} {participantLink}
      </div>
    );
    if (params.getValue(params.id, "eliminated")) {
      return <s>{cell}</s>;
    } else {
      return cell;
    }
  }

  function renderTeamNameCell(params) {
    return params.getValue(params.id, "team") ? (
      <div className="text-truncate" style={{ maxWidth: "100%" }}>
        <Link to={"/team/view/" + params.getValue(params.id, "team")}>
          {params.getValue(params.id, "team_name")}
        </Link>
      </div>
    ) : (
      <></>
    );
  }

  function renderScoreCell(params: GridCellParams) {
    return (
      <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        {tournament?.show_only_top_nr
          ? params.value >= tournament.show_only_top_nr!
            ? ""
            : params.value
          : params.value}
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: Translated.byKey("rank"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "seed",
      headerName: Translated.byKey("seed"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "player",
      headerName: Translated.byKey("player"),
      renderCell: renderPlayerCell,
      valueGetter: getUsername,
      hideSortIcons: true,
      minWidth: 200,
      flex: 1,
      ...commonFields,
    },
    {
      field: "team_name",
      headerName: Translated.byKey("team"),
      renderCell: renderTeamNameCell,
      hideSortIcons: true,
      ...commonFields,
    },
    {
      field: "fide_rating",
      headerName: Translated.byKey("rating"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "federation",
      headerName: Translated.byKey("federation"),
      hideSortIcons: true,
      renderCell: (params) => (
        <FederationDisplay
          value={params.getValue(params.id, "federation") as string}
        />
      ),
      ...commonFields,
    },
    {
      field: "score",
      headerName: Translated.byKey("score"),
      hideSortIcons: true,
      renderCell: renderScoreCell,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "tb1",
      headerName: Translated.byKey("TB1"),
      hideSortIcons: true,
      hide: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "tb2",
      headerName: Translated.byKey("TB2"),
      hideSortIcons: true,
      hide: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "tb3",
      headerName: Translated.byKey("TB3"),
      hideSortIcons: true,
      hide: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
    {
      field: "tb4",
      headerName: Translated.byKey("TB4"),
      hideSortIcons: true,
      hide: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
    },
  ];

  return (
    <DataGrid
      className={`${style.table} ${seen ? "" : style.hide}`}
      autoHeight
      autoPageSize
      rows={participants}
      columns={columns}
    />
  );
};

const TeamsTable: FunctionComponent<{ seen: boolean }> = ({ seen }) => {
  const { tournament, teams } = useTournamentDetail();
  return <></>;
};

type Stats = {
  average_rating: number;
  countries: Array<string>;
  titles: Array<string>;
  longest_game: string | null;
  shortest_game: string | null;
  number_of_players: number;
};

const Stats: FunctionComponent<{ tournamentId: string }> = memo(
  ({ tournamentId }) => {
    const [stats, setStats] = useState<Stats>();
    const [titleCounts, setTitleCounts] = useState({});
    const [countryCounts, setCountryCounts] = useState({});

    function fetchStats(id) {
      fetchJson(`/s/tournament/stats/${id}`, "GET", undefined, (data) => {
        if (data) {
          setStats(data as any);
          const tCounts = {};
          for (let i = 0; i < data.titles.length; i++) {
            const num = data.titles[i];
            tCounts[num] = tCounts[num] ? tCounts[num] + 1 : 1;
          }
          setTitleCounts(tCounts);
          const cCounts = {};
          for (let i = 0; i < data.countries.length; i++) {
            const num = data.countries[i];
            cCounts[num] = cCounts[num] ? cCounts[num] + 1 : 1;
          }
          setCountryCounts(cCounts);
        }
      });
    }

    useEffect(() => {
      if (tournamentId && !stats) {
        fetchStats(tournamentId);
      }
    }, [tournamentId]);

    return (
      <>
        {stats && (
          <Paper style={{ padding: 20 }}>
            <div>
              {Translated.byKey("statsNumberOfPlayers")}:{" "}
              {stats.number_of_players}
            </div>
            <div>
              {Translated.byKey("statsTitledPlayers")}:{" "}
              {Object.keys(titleCounts).map((key) => (
                <span key={key}>
                  {titleCounts[key]}{" "}
                  <span className={style["player-title"]}>{key}</span>
                </span>
              ))}
            </div>
            <div>
              {Translated.byKey("statsCountries")}: Total Countries: &nbsp;
              {[...new Set(stats.countries)].length} &nbsp;
              {Object.keys(countryCounts).map((key) => (
                <span key={key}>
                  - <FederationDisplay value={key} /> ({countryCounts[key]})
                  &nbsp;
                </span>
              ))}
            </div>
            <div>
              {Translated.byKey("statsAverageRating")}: {stats.average_rating}
            </div>
            {stats.longest_game && (
              <div>
                <Link to={`/game/play/${stats.longest_game}`}>
                  {Translated.byKey("statsLongestGame")}
                </Link>
              </div>
            )}
            {stats.shortest_game && (
              <div>
                {Translated.byKey("statsShortestGame")}: {stats.shortest_game}
              </div>
            )}
          </Paper>
        )}
      </>
    );
  }
);
const Standings: FunctionComponent<unknown> = () => {
  const [tab, setTab] = React.useState(0);

  const { tournament, participants, is_team_tournament } =
    useTournamentDetail();

  return (
    <>
      {tournament &&
        Array.isArray(participants) &&
        participants.length > 0 &&
        (participants[0] as any).id && (
          <div className={style["standings-container"]}>
            <div className={style["centered-container"]}>
              <h3 className="mt-4">
                <Translated str="standings" />
              </h3>
            </div>
            <div>
              <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab value={0} label={<Translated str="individual" />} />
                {is_team_tournament && (
                  <Tab value={1} label={<Translated str="team" />} />
                )}
                <Tab value={2} label={<Translated str="stats" />} />
              </Tabs>
            </div>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <ParticipantsTable seen={tab === 0} />
                <TeamsTable seen={tab === 1} />
                {tab === 2 && <Stats tournamentId={tournament.id} />}
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export { Standings };
