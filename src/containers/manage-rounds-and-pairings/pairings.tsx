import React, { FunctionComponent } from "react";
import { ListGroup } from "react-bootstrap";
import { useTournamentPairing } from "../../context/tournament-pairing";

interface Props {
  round: number;
}

const Pairings: FunctionComponent<Props> = ({ round }) => {
  const { pairings } = useTournamentPairing();
  return (
    <>
      {Array.isArray(pairings) && pairings.length > 0 && (
        <ListGroup>
          {pairings
            .filter((pairing) => pairing.round === round)
            .map((pairing, i) => (
              <ListGroup.Item key={i}>
                (white) {pairing.white_name} - (black) {pairing.black_name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </>
  );
};
export { Pairings };
