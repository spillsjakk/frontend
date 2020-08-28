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
  Player: 0,
  ClubManager: 1,
  OrganizationManager: 2,
  Admin: 3
};