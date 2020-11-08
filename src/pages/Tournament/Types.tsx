export type Tournament = {
  id: string;
  name: string;
  organizer: string;
  description: string;
  start_date: string;
  end_date: string;
  kind: string;
  default_otb: boolean;
  rounds?: number;
  publicly_viewable: boolean;
  random_seeding: boolean;
  per_team_limit?: number;
  first_online_pairing: string;
  online_pairing_interval: number;
  initial_time: number;
  increment: number;
  current_online_pairing_time: string;
  self_joinable: boolean;
  show_only_top_nr?: number;
};

export type Participant = {
  account: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  fide_number?: number;
  fide_rating?: number;
  federation?: string;
  score: number;
  eliminated: boolean;
  seed: number;
  ghost?: boolean;
  team?: string;
  team_name?: string;
  tb1?: number;
  tb2?: number;
  tb3?: number;
  tb4?: number;
};

export type TeamParticipant = {
  team_id: string;
  name?: string;
  match_score: number;
  game_score: number;
  eliminated: boolean;
  seed: number;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  club: string;
};

export type Pairing = {
  round: number;
  white: string;
  white_name?: string;
  black: string;
  black_name?: string;
  outcome?: number;
  forfeit: boolean;
  white_ghost?: boolean;
  white_title?: string;
  black_ghost?: boolean;
  black_title?: string;
  online: boolean;
};

export type LightGame = {
  id: string;
  start: string;
  finished: boolean;
};

export type TKOSeparation = {
  tournament: string;
  round: number;
  player_one: string;
  player_two: string;
  game1?: number;
  game2?: number;
};

export type Account = {
  id: string;
  first_name: string;
  last_name: string;
  fide_number?: number;
  fide_rating?: number;
  title?: string;
  fide_federation?: string;
  birth_date?: string;
  sex?: string;
  ghost: boolean;
  provisional_fide_rating?: number;
};
