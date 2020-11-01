import React, { Context, useContext } from "react";

interface Tournament {
  id: string;
}

export interface TournamentContext {
  tournament: Tournament;
}

const TournamentContext: Context<Partial<
  TournamentContext
>> = React.createContext({});

export const TournamentProvider = TournamentContext.Provider;
export default TournamentContext;
export const useTournament = () => useContext(TournamentContext);
