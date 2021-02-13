import React, { FunctionComponent } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Board } from "./board";
import style from "./style.module.scss";

interface Props {
  data: any;
}

const Miniboards: FunctionComponent<Props> = ({ data }) => {
  return (
    <>
      <Container id={style.miniboards}>
        <Row>
          {data &&
            data.map((game) => (
              <Col key={game.id} md="3">
                <Board game={game} />
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export { Miniboards };
