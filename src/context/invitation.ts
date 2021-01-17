import React, { Context, useContext } from "react";

export type InviterType = 0 | 1 | null;

export type Invitation = {
  id: string;
  invitertype: InviterType;
  inviterid: string;
  invitername: string;
};

export interface InvitationContext {
  invitation: Invitation;
}

export const defaultInvitationContext: InvitationContext = {
  invitation: {
    id: "",
    invitertype: null,
    inviterid: "",
    invitername: "",
  },
};

const InvitationContext: Context<InvitationContext> = React.createContext(
  defaultInvitationContext
);

export const InvitationProvider = InvitationContext.Provider;
export default InvitationContext;
export const useInvitation = () => useContext(InvitationContext);
