import {
  Button,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/core";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { List, ViewModule } from "@material-ui/icons";
import React, { FunctionComponent, memo, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { useTournamentDetail } from "../../../context/tournament-detail";
import style from "./style.module.scss";
import { useOnlineStatus } from "../../../hocs/with-online-statuses/index";
import { Online, Offline } from "../../../components/status-circles";
import { Miniboards } from "../../../components/miniboards";

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

const ListView: FunctionComponent<{ round: number }> = memo(({ round }) => {
  const [pageSize, setPageSize] = useState(15);

  const { pairings, tournament, tko_separation, games } = useTournamentDetail();

  const { onlineStatus } = useOnlineStatus();

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
      headerName: Translated.byKey("boardNumber"),
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
      minWidth: 200,
      flex: 1,
    },
    {
      field: "result",
      headerName: "Result",
      renderCell: renderResultCell,
      hideSortIcons: true,
      ...commonFields,
      minWidth: 100,
    },
    {
      field: "black",
      headerName: "Black",
      renderCell: (params: any) => renderPlayerCell(params, "black"),
      hideSortIcons: true,
      ...commonFields,
      minWidth: 200,
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
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          className={`${style.table}`}
          autoHeight
          pageSize={pageSize}
          onPageSizeChange={(pageSize: number) => {
            setPageSize(pageSize);
          }}
          rowsPerPageOptions={[15, 30, 50]}
          pagination
          rows={pairings.filter(
            (p) => p.round === round && p.white !== "bye" && p.black !== "bye"
          )}
          columns={columns}
        />
      </div>
    </div>
  );
});

const MiniBoardsView: FunctionComponent<{ round: number }> = memo(
  ({ round }) => {
    const { pairings, tournament, games } = useTournamentDetail();

    function getGameData() {
      const result = [];
      if (
        !(Array.isArray(pairings) && pairings.length && tournament && games)
      ) {
        return [];
      }
      pairings
        .filter((p) => p.round === round)
        .forEach((pairing) => {
          if (!pairing) {
            return [];
          }
          if (pairing.white === "bye" || pairing.black === "bye") {
            return;
          }
          const localGames =
            games[
              pairing.round.toString() +
                "_" +
                pairing.white +
                "_" +
                pairing.black
            ] ||
            games[
              pairing.round.toString() +
                "_" +
                pairing.black +
                "_" +
                pairing.white
            ] ||
            [];
          result.push(
            ...localGames.map((game) => ({
              ...game,
              outcome: pairing.outcome,
              round: pairing.round,
              whiteName: tournament.show_only_usernames
                ? pairing.white_username
                : pairing.white_name,
              blackName: tournament.show_only_usernames
                ? pairing.black_username
                : pairing.black_name,
              white: pairing.white,
              black: pairing.black,
            }))
          );
        });
      return result;
    }
    return (
      <>
        <Miniboards data={getGameData()} tournament={tournament} />
      </>
    );
  }
);

export const participantLimit = 350;

const Pairings: FunctionComponent<Props> = ({
  showHeader = true,
  defaultMiniboards = false,
}) => {
  const { pairings, participants } = useTournamentDetail();

  const defaultType = Array.isArray(participants)
    ? participants.length > participantLimit
      ? "list"
      : defaultMiniboards
      ? "miniboards"
      : "list"
    : "list";

  const [type, setType] = useState(defaultType);
  const [tab, setTab] = useState(0);
  const [uniqueTabs, setUniqueTabs] = useState([]);

  const params = useParams<{ tid: string }>();

  useEffect(() => {
    if (Array.isArray(pairings) && pairings.length > 0) {
      setType(defaultType);
      const result = Array.from(new Set(pairings.map((p) => p.round)));
      setUniqueTabs(result);
      setTab(result.length);
    }
  }, [pairings]);

  return (
    <div className={style["min-height"]}>
      {Array.isArray(pairings) && pairings.length > 0 && (
        <div className="mt-4">
          <div className={style["centered-container"]}>
            {showHeader && (
              <>
                <h3>
                  <Translated str="pairings" />
                </h3>
                <div className={style["pairing-view-toggle"]}>
                  {participants.length <= participantLimit && (
                    <ToggleButtonGroup
                      value={type}
                      exclusive
                      onChange={(e, newValue) => {
                        if (newValue) setType(newValue);
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
                  )}
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
          {type === "miniboards" && <MiniBoardsView round={tab} />}
          {type === "list" && <ListView round={tab} />}
          <div
            style={{
              display: "flex",
              width: "100%",
              flexFlow: "row-reverse",
              flexDirection: "column",
            }}
          >
            <Link to={`/tournament/view/${params.tid}/pairings/${tab}`}>
              <Button>
                <Translated str="printoutPage" /> (<Translated str="round" />{" "}
                {tab})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export { Pairings };
