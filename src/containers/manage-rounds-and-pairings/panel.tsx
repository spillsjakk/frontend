import React, { FunctionComponent } from "react";
import { Tabs, Tab, Badge } from "react-bootstrap";
import { useTournamentRound } from "../../context/tournament-round";
import { Pairings } from "./pairings";
import { DeleteButton } from "./delete-button";
import { AddPairingForm } from "./add-pairing-form";
import styles from "./style.module.css";
import Translated from "../../components/Translated";

const Panel: FunctionComponent<{}> = () => {
  const roundContext = useTournamentRound();

  return (
    <>
      {Array.isArray(roundContext.rounds) && roundContext.rounds.length > 0 && (
        <>
          <Tabs
            defaultActiveKey={roundContext.rounds[0].number.toString()}
            transition={false}
          >
            {roundContext.rounds.map((round, i) => (
              <Tab
                key={round.number}
                eventKey={round.number.toString()}
                title={
                  <>
                    {round.name}
                    {roundContext.rounds.length - 1 === i && (
                      <DeleteButton
                        onClick={() => roundContext.delete()}
                        tooltip={Translated.byKey("deleteRound")}
                      />
                    )}
                  </>
                }
              >
                <Badge className={styles["start-date-badge"]} variant="info">
                  {round.start_date}
                </Badge>
                <AddPairingForm round={round} />
                <Pairings round={round.number} />
              </Tab>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
};
export { Panel };
