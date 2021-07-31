import React, { FunctionComponent } from "react";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { Tabs, Tab } from "@material-ui/core";
import { useTournamentDetail } from "../../../context/tournament-detail";
import Translated from "../../../components/translated";
import { useOnlineStatus } from "../../../hocs/with-online-statuses";
import { Link } from "react-router-dom";
import { Online } from "./online";
import { Offline } from "./offline";
import style from "./style.module.scss";
import FederationDisplay from "../../../components/FederationDisplay";

const commonFields = {
  headerClassName: style["table-header"],
  cellClassName: style["table-cell"],
  width: 120,
};

const Standings: FunctionComponent<unknown> = () => {
  const [tab, setTab] = React.useState(0);

  const { tournament, ssw, is_team_tournament, participants, teams } =
    useTournamentDetail();
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
                <Tab label={<Translated str="individual" />} />
                <Tab label={<Translated str="team" />} />
                <Tab label={<Translated str="stats" />} />
              </Tabs>
            </div>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className={`${style.table} ${tab === 0 ? "" : style.hide}`}
                  autoHeight
                  autoPageSize
                  rows={participants}
                  columns={columns}
                />
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export { Standings };
