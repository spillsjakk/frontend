import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Invitation,
  InvitationProvider,
  defaultInvitationContext,
} from "../../context/invitation";
import { fetchCall } from "../../functions";

interface Props {
  id: string;
}

const WithInvitation: FunctionComponent<Props> = ({ children, id }) => {
  const [invitation, setInvitation] = useState<Invitation>(
    defaultInvitationContext.invitation
  );

  function fetchInvitation() {
    fetchCall(
      `/s/registrations/invitations/${id}`,
      "GET",
      undefined,
      (response) => {
        if (response) {
          setInvitation(response);
        }
      }
    );
  }
  useEffect(() => {
    fetchInvitation();
  }, []);
  return (
    <InvitationProvider value={{ invitation }}>{children}</InvitationProvider>
  );
};

export { WithInvitation };
