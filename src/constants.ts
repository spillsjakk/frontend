export const defaultDate = "1970-01-01T00:00:00Z";

export const KIND = {
  // Knockout: 0,
  SwissDutch: 1,
  // TeamKnockout: 2,
  TeamSwissDutch: 3,
  TeamMonrad: 4,
  TeamKonrad: 5,
  LimitedPlayerTeam: 6,
  ManualPairing: 7,
  RoundRobin: 8,
  TeamRoundRobin: 9,
};

export enum VARIANT {
  Chess,
  Antichess,
  PawnVsPawn,
}

export const TIEBREAKER = {
  AverageOpponentRating: 0,
  Buchholz: 1,
  MedianBuchholz: 2,
  MedianBuchholz2: 3,
  BuchholzCut1: 4,
  BuchholzCut2: 5,
};

export const DRAW_OFFER_SIGN = "(=)";
