import React, { Context, useContext } from "react";

export type Invitation = {
  id: string;
  invitertype: 0 | 1;
  inviterid: string;
  invitername: string;
};

export interface InvitationContext {
  invitation: Invitation;
}

export const defaultInvitationContext: InvitationContext = {
  invitation: {
    id: "",
    invitertype: 0,
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
