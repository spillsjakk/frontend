import React, { FunctionComponent } from "react";
import { Button } from "react-bootstrap";
import Translated from "../../components/Translated";
import { useTournamentRound } from "../../context/tournament-round";

const AddRound: FunctionComponent<{}> = () => {
  const roundContext = useTournamentRound();
  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          roundContext.add();
        }}
      >
        <Translated str="addRound" />
      </Button>
    </>
  );
};
export { AddRound };
