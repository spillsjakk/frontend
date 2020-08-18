import React from "react";

export type UserContextDataType = {
  authenticated: boolean,
  info?: {
    id: string,
    name: string,
    permissions: number
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