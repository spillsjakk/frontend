import React, { Context, useContext } from "react";

export interface Participant {
  account?: string;
  first_name?: string;
  last_name?: string;
  fide_number?: number;
}

export interface TournamentParticipantsContext {
  participants: Array<Participant>;
}

const TournamentParticipantsContext: Context<TournamentParticipantsContext> = React.createContext(
  {
    participants: [] as Array<Participant>,
  }
);

export const TournamentParticipantsProvider =
  TournamentParticipantsContext.Provider;
export default TournamentParticipantsContext;
export const useTournamentParticipants = () =>
  useContext(TournamentParticipantsContext);
