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
    </>
  );
};

export { Miniboards };
