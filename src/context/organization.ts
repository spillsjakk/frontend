import React, { Context, useContext } from "react";

export interface Organization {
  name: string;
  description: string;
  manager: string;
  country: string;
  profile_picture: string;
}

const OrganizationContext: Context<Partial<Organization>> = React.createContext(
  {}
);

export const OrganizationProvider = OrganizationContext.Provider;
export default OrganizationContext;
export const useOrganization = () => useContext(OrganizationContext);
