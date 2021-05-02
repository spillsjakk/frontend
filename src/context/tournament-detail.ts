import React, { Context, useContext } from "react";
import {
  Tournament,
  Participant,
  TeamParticipant,
  Pairing,
  Team,
  LightGame,
  TKOSeparation,
} from "../pages/Tournament/Types";
import { Round } from "./tournament-round";

export interface TournamentDetail {
  tournament: Tournament;
  participants: Participant[];
  pairings: Pairing[];
  teams: TeamParticipant[];
  is_team_tournament: boolean;
  managed_teams?: Team[];
  can_start: boolean;
  games: { [id: string]: LightGame[] };
  tko_separation?: { [id: string]: TKOSeparation };
  self_join_teams?: Team[];
  is_participating: boolean;
  organiser_name: string;
  ssw?: string[];
  rounds: Array<Round>;
  update: () => void;
  sorted?: boolean;
  league?: { league_name: string; league_id: string };
}

export type TournamentDetailContext = TournamentDetail;

const TournamentDetailContext: Context<
  Partial<TournamentDetailContext>
> = React.createContext({});

export const TournamentDetailProvider = TournamentDetailContext.Provider;
export default TournamentDetailContext;
export const useTournamentDetail = () => useContext(TournamentDetailContext);
