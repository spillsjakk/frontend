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

const WithTournamentPairing: FunctionComponent<{ tournamentId: string }> = ({
  children,
  tournamentId,
}) => {
  const [pairings, setPairings] = useState<Array<Pairing>>([]);

  async function fetchPairings() {
    fetchJson(
      `/s/pairings?tournament=${tournamentId}`,
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
        tournament: tournamentId,
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
        tournament: tournamentId,
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
      if (tournamentId) {
        addPairing({
          whiteAccountId,
          blackAccounntId,
          round,
        });
      }
    },
    [tournamentId]
  );

  const del = useCallback(
    (whiteAccountId: string, blackAccounntId: string, round: number) => {
      if (tournamentId) {
        deletePairing({
          whiteAccountId,
          blackAccounntId,
          round,
        });
      }
    },
    [tournamentId]
  );

  useEffect(() => {
    if (tournamentId) {
      fetchPairings();
    }
  }, [tournamentId]);

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
