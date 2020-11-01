import React, { Context, useContext } from "react";

export interface Round {
  start_date: string;
  number: number;
  name: string;
}

export interface TournamentRoundContext {
  rounds: Array<Round>;
  add: () => void;
  delete: () => void;
}

const TournamentRoundContext: Context<TournamentRoundContext> = React.createContext(
  {
    rounds: [] as Array<Round>,
    add: () => {},
    delete: () => {},
  }
);

export const TournamentRoundProvider = TournamentRoundContext.Provider;
export default TournamentRoundContext;
export const useTournamentRound = () => useContext(TournamentRoundContext);
