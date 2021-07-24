import React, { FunctionComponent, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
      <Container id={style.miniboards}>
        <Row id={style.row}>
          {Array.isArray(boardsToShow) &&
            boardsToShow.map((game) => (
              <div key={game.id}>
                <p id={style.pairingnumber}>{game.boardNumber}</p>
                <Col md="3">
                  <Board game={game} />
                </Col>
              </div>
            ))}
        </Row>
        <Pagination
          count={Array.isArray(data) ? Math.ceil(data.length / 12) : 0}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Container>
    </>
  );
};

export { Miniboards };
