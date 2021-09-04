import React, { FunctionComponent, useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup, Grid } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Tooltip from '@material-ui/core/Tooltip';
import { Pagination } from "@material-ui/lab";
import { Board } from "./board";
import style from "./style.module.scss";

interface Props {
  data: any;
}

const Miniboards: FunctionComponent<Props> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [boardsToShow, setBoardsToShow] = useState([]);
  const [selectedDisplayOption, setSelectedDisplayOption] = useState("default");

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
            if ((page - 1) * 12 <= index && index < page * 12) {
              return true;
            }
          })
          .map((game, index) => ({ ...game, boardNumber: index + 1 }))
      );
    }
  }, [page, data, selectedDisplayOption]);

  return (
    <>
      <Grid container id={style.miniboards}>
        {Array.isArray(boardsToShow) &&
          boardsToShow.map((game) => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={3}
              item
              key={game.id}
              className={style.board}
            >
              <div className={style["flex-center"]}>
                <p id={style.pairingnumber}>{game.boardNumber}</p>
                <Board game={game} />
              </div>
            </Grid>
          ))}
      </Grid>
      <Pagination
        count={Array.isArray(data) ? Math.ceil(data.length / 12) : 0}
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
          <ToggleButton value="finished">
            <Tooltip title="Show only ongoing">
              <ViewModuleIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="ongoing">
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