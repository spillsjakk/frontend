import React from "react";

export type UserContextDataType = {
  authenticated: boolean | null;
  info?: {
    id: string;
    name: string;
    level: number;
    powers: {
      organization_all: boolean;
      organization_arbiter: boolean;
      organization_editor: boolean;
      club_all: boolean;
      club_arbiter: boolean;
      club_editor: boolean;
      team_captain: boolean;
    };
  };
};

const defaults: UserContextDataType = {
  authenticated: null,
  info: undefined,
};

export const UserContext = React.createContext({
  user: defaults,
  setUser: (_: UserContextDataType) => {},
  checkUser: () => {},
});

export const useUser = () => React.useContext(UserContext);

export const Levels = {
  Player: 0,
  ClubManager: 1,
  OrganizationManager: 2,
  Admin: 3,
};
