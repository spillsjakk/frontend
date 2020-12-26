import React, { FunctionComponent, useState } from "react";
import { fetchJson } from "../../functions";
import { useTournamentRound } from "../../context/tournament-round";
import { RoundSetupPopupProvider } from "../../context/round-setup-popup";
import { useTournament } from "../../context/tournament";
import { Modal, Button } from "react-bootstrap";
import Translated from "../../components/translated";

const WithRoundSetupPopup: FunctionComponent<{}> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [roundNumber, setRoundNumber] = useState(0);

  const { tournament } = useTournament();
  const { fetch } = useTournamentRound();

  function setupRound() {
    const roundStartDate = new Date(`${startDate} ${startTime}`);
    fetchJson(
      `/s/rounds/setup`,
      "PATCH",
      {
        tournament: tournament!.id,
        number: roundNumber,
        start_date: roundStartDate.toISOString(),
      },
      () => {
        fetch();
      }
    );
    setShow(false);
  }
  return (
    <RoundSetupPopupProvider
      value={{
        open: (number: number) => {
          setRoundNumber(number);
          setShow(true);
        },
      }}
    >
      {children}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Translated str="fillDateAndTime" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min="2020-01-01"
            max="2099-12-31"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setupRound()}>
            {Translated.byKey("setupRound")}
          </Button>
        </Modal.Footer>
      </Modal>
    </RoundSetupPopupProvider>
  );
};

export { WithRoundSetupPopup };
