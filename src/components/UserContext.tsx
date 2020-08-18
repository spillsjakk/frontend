import React from "react";

export type UserContextDataType = {
  authenticated: boolean,
  info?: {
    id: string,
    name: string,
    level: number
  }
}

let defaults: UserContextDataType = {
  authenticated: false,
  info: undefined
}

export const UserContext = React.createContext({
  user: defaults,
  setUser: (_: UserContextDataType) => {}
});

export const Levels = {
  Participant: 0,
  TeamManager: 1,
  TournamentOrganizer: 2,
  Federation: 3,
  Admin: 4
};