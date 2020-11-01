import React, { Context, useContext } from "react";

export interface Participants {
  account?: string;
  first_name?: string;
  last_name?: string;
  fide_number?: number;
}

export interface TournamentParticipantsContext {
  participants: Array<Participants>;
}

const TournamentParticipantsContext: Context<TournamentParticipantsContext> = React.createContext(
  {
    participants: [] as Array<Participants>,
  }
);

export const TournamentParticipantsProvider =
  TournamentParticipantsContext.Provider;
export default TournamentParticipantsContext;
export const useTournamentParticipants = () =>
  useContext(TournamentParticipantsContext);
