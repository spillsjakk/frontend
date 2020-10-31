import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchJson } from "../../functions";
import { Round, TournamentRoundProvider } from "../../context/tournament-round";
import { useTournament } from "../../context/tournament";

const WithTournamentRound: FunctionComponent = ({ children }) => {
  const [rounds, setRounds] = useState<Array<Round>>([]);

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

  const add = useCallback(() => {
    if (tournament && tournament.id) {
      // TODO: get date and time from user
      addRound({
        tournament: tournament?.id,
        number: rounds.length + 1,
        name: `Round ${rounds.length + 1}`,
        start_date: "2020-10-26 19:11",
      });
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
    </TournamentRoundProvider>
  );
};
export { WithTournamentRound };
