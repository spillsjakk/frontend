import React, { FunctionComponent, useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup, Grid } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Tooltip from "@material-ui/core/Tooltip";
import { Pagination } from "@material-ui/lab";
import { Board } from "./board";
import style from "./style.module.scss";

interface Props {
  data: any;
  tournament: any;
}

export type RealTimeGame = {
  t: string;
  black: string;
  white: string;
  board: string;
  wc: number;
  bc: number;
  wic: number;
  bic: number;
  moves: string;
  finished: boolean;
  result: number;
};

const MINIBOARDS_PER_PAGE = 12;

const Miniboards: FunctionComponent<Props> = ({ data, tournament }) => {
  const [page, setPage] = useState(1);
  const [boardsToShow, setBoardsToShow] = useState([]);
  const [selectedDisplayOption, setSelectedDisplayOption] = useState("default");
  const [realTimeGames, setRealTimeGames] = useState<Array<RealTimeGame>>();

  useEffect(() => {
    if (!tournament.id) return;
    const eventSource = new EventSource(
      `/s-tournament/tournament/listen-data/${tournament.id}`
    );

    eventSource.addEventListener("game-update", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setRealTimeGames((prev) =>
          prev
            ? prev.map((rtg) =>
                rtg.black === data.black && rtg.white === data.white
                  ? { ...rtg, ...data }
                  : rtg
              )
            : []
        );
      } catch (error) {
        console.error("error while parsing game update event");
      }
    });

    eventSource.addEventListener("games", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setRealTimeGames(data);
      } catch (error) {
        console.error("error while parsing games event");
      }
    });

    return () => eventSource.close();
  }, [tournament]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setBoardsToShow(
        data
          .filter((game) => {
            if (selectedDisplayOption === "finished") {
              return game.finished;
            } else if (selectedDisplayOption === "ongoing") {
              return !game.finished;
            }
            return true;
          })
          .filter((game, index) => {
            if (
              (page - 1) * MINIBOARDS_PER_PAGE <= index &&
              index < page * MINIBOARDS_PER_PAGE
            ) {
              return true;
            }
          })
          .map((game, index) => ({
            ...game,
            boardNumber: (page - 1) * MINIBOARDS_PER_PAGE + index + 1,
          }))
      );
    }
  }, [page, data, selectedDisplayOption]);

  return (
    <>
      <Grid container id={style.miniboards}>
        {Array.isArray(boardsToShow) &&
          boardsToShow.map((game) => (
            <Grid sm={6} md={4} item key={game.id} className={style.board}>
              <div className={style["flex-center"]}>
                <p id={style.pairingnumber}>{game.boardNumber}</p>
                <Board
                  game={game}
                  tournament={tournament}
                  realtimegame={realTimeGames?.find(
                    (rtg) =>
                      rtg.black === game.black && rtg.white === game.white
                  )}
                />
              </div>
            </Grid>
          ))}
      </Grid>
      <Pagination
        count={
          Array.isArray(data) ? Math.ceil(data.length / MINIBOARDS_PER_PAGE) : 0
        }
        page={page}
        onChange={(e, value) => setPage(value)}
        className={style.pagination}
      />
      <div className={style.toogle}>
        <ToggleButtonGroup
          orientation="horizontal"
          exclusive
          value={selectedDisplayOption}
          onChange={(e, newValue) => {
            setSelectedDisplayOption(newValue);
          }}
          aria-label="text alignment"
        >
          <ToggleButton value="default">
            <Tooltip title="See all">
              <ViewListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="ongoing">
            <Tooltip title="Show only ongoing games">
              <ViewModuleIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="finished">
            <Tooltip title="Show only finished games">
              <ViewQuiltIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </>
  );
};
export { Miniboards };
