import React, { FunctionComponent, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useTournamentPairing } from "../../context/tournament-pairing";
import { useTournamentRound } from "../../context/tournament-round";
import { Pairings } from "./pairings";

const Panel: FunctionComponent<{}> = () => {
  const [whiteAccountId, setWhiteAccountId] = useState("");
  const [blackAccountId, setBlackAccountId] = useState("");

  const pairingContext = useTournamentPairing();

  const { rounds } = useTournamentRound();
  function onPairingCreate(round: number) {
    return (e: any) => {
      e.preventDefault();
      pairingContext.add(whiteAccountId, blackAccountId, round);
    };
  }
  return (
    <>
      {Array.isArray(rounds) && rounds.length > 0 && (
        <>
          <Tabs
            defaultActiveKey={rounds[0].number.toString()}
            transition={false}
          >
            {rounds.map((round) => (
              <Tab
                key={round.number}
                eventKey={round.number.toString()}
                title={round.name}
              >
                <form onSubmit={onPairingCreate(round.number)}>
                  <input
                    placeholder="Add Player (White)"
                    onChange={(e) => setWhiteAccountId(e.target.value)}
                  />
                  <input
                    placeholder="Add Player (Black)"
                    onChange={(e) => setBlackAccountId(e.target.value)}
                  />
                  <button type="submit">Add Pairing</button>
                  <Pairings round={round.number} />
                </form>
              </Tab>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
};
export { Panel };
