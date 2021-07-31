import { Tab, Tabs, ToggleButton, ToggleButtonGroup } from "@material-ui/core";
import {
  GridColDef,
  DataGrid,
  GridPageChangeParams,
} from "@material-ui/data-grid";
import { List, ViewModule } from "@material-ui/icons";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Translated from "../../../components/translated";
import { useTournamentDetail } from "../../../context/tournament-detail";
import style from "./style.module.scss";
import { useOnlineStatus } from "../../../hocs/with-online-statuses/index";
import { Online } from "./online";
import { Offline } from "./offline";

interface Props {
  showHeader?: boolean;
  defaultMiniboards?: boolean;
}

const commonFields = {
  headerClassName: style["table-header"],
  cellClassName: style["table-cell"],
  width: 120,
};

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

const Pairings: FunctionComponent<Props> = ({
  showHeader = true,
  defaultMiniboards = false,
}) => {
  const [type, setType] = useState(defaultMiniboards ? "miniboards" : "list");
  const [tab, setTab] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [uniqueTabs, setUniqueTabs] = useState([]);

  const { pairings, tournament, tko_separation, games } = useTournamentDetail();

  const { onlineStatus } = useOnlineStatus();

  useEffect(() => {
    if (Array.isArray(pairings) && pairings.length > 0) {
      const result = Array.from(new Set(pairings.map((p) => p.round)));
      setUniqueTabs(result);
      setTab(result.length);
    }
  }, [pairings]);

  function getUsername(params, color) {
    return tournament?.show_only_usernames
      ? params.getValue(params.id, `${color}_username`) || ""
      : params.getValue(params.id, `${color}_name`);
  }

  function renderPlayerCell(params, color) {
    const participantLink = (
      <div className="text-truncate">
        <Link to={"/profile/" + params.getValue(params.id, color)}>
          {getUsername(params, color)}
        </Link>
      </div>
    );
    const statusCircle = (
      <>
        {onlineStatus.find(
          (obj) => obj.account === params.getValue(params.id, color)
        )?.online === true ? (
          <Online />
        ) : (
          <Offline />
        )}
      </>
    );
    const titleSpan = params.getValue(params.id, `${color}_title`) ? (
      <div className={style["player-title"]}>
        {params.getValue(params.id, `${color}_title`)}
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

  function renderResultCell(params) {
    return (
      <>
        {tournament.kind !== "TeamKnockout"
          ? outcomeToStr(params.getValue(params.id, "outcome"))
          : outcomeToStr(
              tko_separation?.[
                params.getValue(params.id, "round").toString() +
                  "_" +
                  params.getValue(params.id, "white")
              ].game1
            )}
      </>
    );
  }

  function renderLinkCell(params) {
    const localGames =
      games[
        `${params.getValue(params.id, "round")}_${params.getValue(
          params.id,
          "white"
        )}_${params.getValue(params.id, "black")}`
      ] ||
      games[
        `${params.getValue(params.id, "round")}_${params.getValue(
          params.id,
          "black"
        )}_${params.getValue(params.id, "white")}`
      ] ||
      [];
    const sortedGames = localGames.sort((a, b) =>
      a.start > b.start ? 1 : a.start === b.start ? 0 : -1
    );
    return (
      <>
        {sortedGames.map((g) => (
          <div key={g.id}>
            <Link to={"/game/play/" + g.id}>
              <Translated str={g.finished ? "finished" : "ongoing"} />
            </Link>
          </div>
        ))}
      </>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "boardNumber",
      headerName: "Board Number",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      ...commonFields,
      minWidth: 200,
    },
    {
      field: "white",
      headerName: "White",
      renderCell: (params: any) => renderPlayerCell(params, "white"),
      hideSortIcons: true,
      ...commonFields,
      flex: 1,
    },
    {
      field: "result",
      headerName: "Result",
      renderCell: renderResultCell,
      hideSortIcons: true,
      ...commonFields,
    },
    {
      field: "black",
      headerName: "Black",
      renderCell: (params: any) => renderPlayerCell(params, "black"),
      hideSortIcons: true,
      ...commonFields,
      flex: 1,
    },
    {
      field: "link",
      headerName: "Link",
      renderCell: renderLinkCell,
      hideSortIcons: true,
      ...commonFields,
    },
  ];

  return (
    <>
      {Array.isArray(pairings) && pairings.length > 0 && (
        <div className="mt-4">
          <div className={style["centered-container"]}>
            {showHeader && (
              <>
                <h3>
                  <Translated str="pairings" />
                </h3>
                <div className={style["pairing-view-toggle"]}>
                  <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={(e, newValue) => {
                      setType(newValue);
                    }}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="miniboards">
                      <ViewModule />
                    </ToggleButton>
                    <ToggleButton value="list">
                      <List />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </>
            )}
          </div>
          <div>
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
            >
              {uniqueTabs.map((round) => (
                <Tab key={round} label={`Round ${round}`} value={round} />
              ))}
            </Tabs>
          </div>
          {type === "miniboards" && <></>}
          {type === "list" && (
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className={`${style.table}`}
                  autoHeight
                  pageSize={pageSize}
                  onPageSizeChange={(params: GridPageChangeParams) => {
                    setPageSize(params.pageSize);
                  }}
                  rowsPerPageOptions={[15, 30, 50]}
                  pagination
                  rows={pairings.filter((p) => p.round === tab)}
                  columns={columns}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { Pairings };
