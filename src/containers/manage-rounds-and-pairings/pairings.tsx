import React, { FunctionComponent } from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../../components/Translated";
import { useTournamentPairing } from "../../context/tournament-pairing";
import { DeleteButton } from "./delete-button";

interface Props {
  round: number;
}

const Pairings: FunctionComponent<Props> = ({ round }) => {
  const pairingContext = useTournamentPairing();
  return (
    <>
      {Array.isArray(pairingContext.pairings) &&
        pairingContext.pairings.length > 0 && (
          <ListGroup>
            {pairingContext.pairings
              .filter((pairing) => pairing.round === round)
              .map((pairing, i) => (
                <ListGroup.Item key={i}>
                  (white) {pairing.white_name} - (black) {pairing.black_name}
                  <DeleteButton
                    onClick={() =>
                      pairingContext.delete(
                        pairing.white,
                        pairing.black,
                        pairing.round
                      )
                    }
                    tooltip={Translated.byKey("deletePairing")}
                  />
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
    </>
  );
};
export { Pairings };
