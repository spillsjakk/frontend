import React, { FunctionComponent, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Board } from "./board";
import style from "./style.module.scss";

interface Props {
  data: any;
}

const Miniboards: FunctionComponent<Props> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [boardsToShow, setBoardsToShow] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setBoardsToShow(
        data
          .filter((game, index) => {
            if ((page - 1) * 12 <= index && index < page * 12) {
              return true;
            }
          })
          .map((game, index) => ({ ...game, boardNumber: index + 1 }))
      );
    }
  }, [page, data]);
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        id={style.miniboards}
      >
        {Array.isArray(boardsToShow) &&
          boardsToShow.map((game) => (
            <Grid item key={game.id} className={style.board}>
              <p id={style.pairingnumber}>{game.boardNumber}</p>
              <Board game={game} />
            </Grid>
          ))}
      </Grid>
      <Pagination
        count={Array.isArray(data) ? Math.ceil(data.length / 12) : 0}
        page={page}
        onChange={(e, value) => setPage(value)}
        className={style.pagination}
      />
    </>
  );
};

export { Miniboards };
