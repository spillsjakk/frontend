import React, { Context, useContext } from "react";
import { Tournament } from "../pages/Tournament/Types";

export interface TournamentContext {
  tournament: Tournament;
}

const TournamentContext: Context<
  Partial<TournamentContext>
> = React.createContext({});

export const TournamentProvider = TournamentContext.Provider;
export default TournamentContext;
export const useTournament = () => useContext(TournamentContext);
