import React, { Context, useContext } from "react";

export interface Round {
  start_date: string;
  tournament: string;
  number: number;
  name: string;
}

export interface TournamentRoundContext {
  rounds: Array<Round>;
  add: () => void;
  delete: () => void;
  fetch: () => Promise<void>;
}

const TournamentRoundContext: Context<TournamentRoundContext> =
  React.createContext({
    rounds: [] as Array<Round>,
    add: () => {},
    delete: () => {},
    fetch: () => ({} as any),
  });

export const TournamentRoundProvider = TournamentRoundContext.Provider;
export default TournamentRoundContext;
export const useTournamentRound = () => useContext(TournamentRoundContext);
