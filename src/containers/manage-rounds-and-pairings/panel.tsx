import React, { FunctionComponent } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useTournamentRound } from "../../context/tournament-round";

const Panel: FunctionComponent<{}> = () => {
  const { rounds } = useTournamentRound();

  return (
    <>
      {Array.isArray(rounds) && rounds.length && (
        <>
          <Tabs defaultActiveKey={rounds[0].number.toString()}>
            {rounds.map((round) => (
              <Tab
                key={round.number}
                eventKey={round.number.toString()}
                title={round.name}
              ></Tab>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
};
export { Panel };
