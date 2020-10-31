import React, { FunctionComponent, useEffect, useState } from "react";
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

  useEffect(() => {
    if (tournament && tournament.id) {
      fetchPairings();
    }
  }, [tournament]);

  return (
    <TournamentPairingProvider
      value={{
        pairings,
        update: () => fetchPairings(),
      }}
    >
      {children}
    </TournamentPairingProvider>
  );
};
export { WithTournamentPairing };
