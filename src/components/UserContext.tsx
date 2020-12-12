import React from "react";

export type UserContextDataType = {
  authenticated: boolean | null;
  info?: {
    id: string;
    name: string;
    level: number;
  };
};

const defaults: UserContextDataType = {
  authenticated: null,
  info: undefined,
};

export const UserContext = React.createContext({
  user: defaults,
  setUser: (_: UserContextDataType) => {},
});

export const useUser = () => React.useContext(UserContext);

export const Levels = {
  Player: 0,
  ClubManager: 1,
  OrganizationManager: 2,
  Admin: 3,
};
