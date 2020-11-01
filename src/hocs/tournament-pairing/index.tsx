import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchJson } from "../../functions";
import {
  Pairing,
  TournamentPairingProvider,
} from "../../context/tournament-pairing";
import { useTournament } from "../../context/tournament";

const WithTournamentPairing: FunctionComponent = ({ children }) => {
  const [pairings, setPairings] = useState<Array<Pairing>>([]);

  const { tournament } = useTournament();

  async function fetchPairings() {
    fetchJson(
      `/s/pairings?tournament=${tournament!.id}`,
      "GET",
      undefined,
      (result: Array<Pairing>) => {
        if (Array.isArray(result)) {
          setPairings(result);
        }
      }
    );
  }

  async function addPairing(body: {
    whiteAccountId: string;
    blackAccounntId: string;
    round: number;
  }) {
    fetchJson(
      `/s/pairings`,
      "POST",
      {
        tournament: tournament?.id,
        round: body.round,
        white: body.whiteAccountId,
        black: body.blackAccounntId,
        online: true,
      },
      (result: Array<Pairing>) => {
        setPairings(result);
        fetchPairings();
      }
    );
  }

  async function deletePairing(body: {
    whiteAccountId: string;
    blackAccounntId: string;
    round: number;
  }) {
    fetchJson(
      `/s/pairings`,
      "DELETE",
      {
        tournament: tournament?.id,
        round: body.round,
        white: body.whiteAccountId,
        black: body.blackAccounntId,
      },
      (result: Array<Pairing>) => {
        setPairings(result);
        fetchPairings();
      }
    );
  }

  const add = useCallback(
    (whiteAccountId: string, blackAccounntId: string, round: number) => {
      if (tournament && tournament.id) {
        addPairing({
          whiteAccountId,
          blackAccounntId,
          round,
        });
      }
    },
    [tournament, pairings]
  );

  const del = useCallback(
    (whiteAccountId: string, blackAccounntId: string, round: number) => {
      if (tournament && tournament.id) {
        deletePairing({
          whiteAccountId,
          blackAccounntId,
          round,
        });
      }
    },
    [tournament, pairings]
  );

  useEffect(() => {
    if (tournament && tournament.id) {
      fetchPairings();
    }
  }, [tournament]);

  return (
    <TournamentPairingProvider
      value={{
        pairings,
        add,
        delete: del,
      }}
    >
      {children}
    </TournamentPairingProvider>
  );
};
export { WithTournamentPairing };
