import React, { Context, useContext } from "react";

export interface Pairing {
  tournament: string;
  round: number;
  white: string;
  white_name: string;
  black: string;
  black_name: string;
}

export interface TournamentPairingContext {
  pairings: Array<Pairing>;
  add: (whiteAccountId: string, blackAccountId: string, round: number) => void;
}

const TournamentPairingContext: Context<TournamentPairingContext> = React.createContext(
  {
    pairings: [] as Array<Pairing>,
    add: (whiteAccountId: string, blackAccountId: string, round: number) => {},
  }
);

export const TournamentPairingProvider = TournamentPairingContext.Provider;
export default TournamentPairingContext;
export const useTournamentPairing = () => useContext(TournamentPairingContext);
