import React, { Context, useContext } from "react";

export interface Club {
  id: string;
  name: string;
  description: string;
  manager: string;
  country: string;
  profile_picture: string;
  banner_picture: string;
  address: string;
  website: string;
  email: string;
  teams?: Array<any>;
  members?: Array<any>;
  updateData?: () => void;
}

const ClubContext: Context<Partial<Club>> = React.createContext({});

export const ClubProvider = ClubContext.Provider;
export default ClubContext;
export const useClub = () => useContext(ClubContext);
