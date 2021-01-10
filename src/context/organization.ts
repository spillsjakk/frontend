import React, { Context, useContext } from "react";

export interface Organization {
  id: string;
  name: string;
  description: string;
  manager: string;
  country: string;
  profile_picture: string;
  banner_picture?: string;
  website?: string;
  address?: string;
  email?: string;
  clubs?: Array<any>;
  accounts?: Array<any>;
  updateData?: () => void;
}

const OrganizationContext: Context<Partial<Organization>> = React.createContext(
  {}
);

export const OrganizationProvider = OrganizationContext.Provider;
export default OrganizationContext;
export const useOrganization = () => useContext(OrganizationContext);
