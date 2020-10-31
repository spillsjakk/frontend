import React, { Context, useContext } from "react";

export interface Pairing {
  tournament: string;
  round: number;
  white: string;
  black: string;
}

export interface TournamentPairingContext {
  pairings: Array<Pairing>;
  update: () => void;
}

const TournamentPairingContext: Context<Partial<
  TournamentPairingContext
>> = React.createContext({});

export const TournamentPairingProvider = TournamentPairingContext.Provider;
export default TournamentPairingContext;
export const useTournamentPairing = () => useContext(TournamentPairingContext);
