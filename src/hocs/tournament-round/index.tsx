import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchJson } from "../../functions";
import { Round, TournamentRoundProvider } from "../../context/tournament-round";
import { useTournament } from "../../context/tournament";
import { Modal, Button } from "react-bootstrap";
import Translated from "../../components/Translated";

const WithTournamentRound: FunctionComponent = ({ children }) => {
  const [rounds, setRounds] = useState<Array<Round>>([]);
  const [showAddRoundPopup, setShowAddRoundPopup] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  const { tournament } = useTournament();

  async function fetchRounds() {
    fetchJson(
      `/s/rounds?tournament=${tournament!.id}`,
      "GET",
      undefined,
      (result: Array<Round>) => {
        if (Array.isArray(result)) {
          setRounds(result);
        }
      }
    );
  }

  async function addRound(body: {
    tournament: string;
    number: number;
    name: string;
    start_date: string;
  }) {
    fetchJson(`/s/rounds`, "POST", body, (result: Array<Round>) => {
      setRounds(result);
      fetchRounds();
    });
  }

  function onAddRoundClick() {
    setShowAddRoundPopup(false);
    addRound({
      tournament: tournament!.id,
      number: rounds.length + 1,
      name: `Round ${rounds.length + 1}`,
      start_date: `${startDate} ${startTime}`,
    });
  }

  const add = useCallback(() => {
    if (tournament && tournament.id) {
      setShowAddRoundPopup(true);
    }
  }, [tournament, rounds]);

  useEffect(() => {
    if (tournament && tournament.id) {
      fetchRounds();
    }
  }, [tournament]);

  return (
    <TournamentRoundProvider
      value={{
        rounds,
        add,
      }}
    >
      {children}
      <Modal
        show={showAddRoundPopup}
        onHide={() => setShowAddRoundPopup(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Translated str="fillInDateTime" />
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
          <Button variant="primary" onClick={() => onAddRoundClick()}>
            {Translated.byKey("addRound")}
          </Button>
        </Modal.Footer>
      </Modal>
    </TournamentRoundProvider>
  );
};
export { WithTournamentRound };
