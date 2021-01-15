import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import { InvitationLink } from "./invitation-link";
import { fetchCall } from "../../../functions";

type Invitations = {
  clubs: Array<{
    id: string;
    name: string;
    invitations: Array<string>;
  }>;
  organizations: Array<{
    id: string;
    name: string;
    invitations: Array<string>;
  }>;
};

const GenerateInvitation: FunctionComponent<{}> = () => {
  const [invitations, setInvitations] = useState<Invitations>();

  async function fetchInvitationLinks() {
    fetchCall(
      "/s/registrations/invitations/links",
      "GET",
      undefined,
      (response) => {
        if (
          response &&
          (Array.isArray(response.clubs) ||
            Array.isArray(response.organizations))
        ) {
          setInvitations(response);
        }
      }
    );
  }

  async function createInvitation(id: string, type: 0 | 1) {
    fetchCall(
      `/s/registrations/${id}/invitations`,
      "POST",
      {
        invitertype: type,
        registerertype: 2,
      },
      (response) => {
        if (response) {
          fetchInvitationLinks();
        }
      }
    );
  }

  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "registration-invitation-generation";
    fetchInvitationLinks();
  }, []);

  return (
    <main>
      {invitations &&
        Array.isArray(invitations.organizations) &&
        invitations.organizations.map((organization) => (
          <div key={organization.id}>
            <div className="header">
              {Translated.byKey("organizationInvitations").toUpperCase()}
            </div>
            <div className="box row-flex">
              <div className="name">{organization.name}</div>
              {Array.isArray(organization.invitations) &&
                !organization.invitations.length && (
                  <button
                    onClick={() => createInvitation(organization.id, 0)}
                    className="blue-button"
                  >
                    {Translated.byKey("create")}
                  </button>
                )}
              {Array.isArray(organization.invitations) &&
                organization.invitations.map((invitation) => (
                  <InvitationLink key={invitation} invitationId={invitation} />
                ))}
            </div>
          </div>
        ))}
      {invitations &&
        Array.isArray(invitations.clubs) &&
        invitations.clubs.map((club) => (
          <div key={club.id}>
            <div className="header">
              {Translated.byKey("clubInvitations").toUpperCase()}
            </div>
            <div className="box row-flex">
              <div className="name">{club.name}</div>
              {Array.isArray(club.invitations) && !club.invitations.length && (
                <button
                  onClick={() => createInvitation(club.id, 1)}
                  className="blue-button"
                >
                  {Translated.byKey("create")}
                </button>
              )}
              {Array.isArray(club.invitations) &&
                club.invitations.map((invitation) => (
                  <InvitationLink key={invitation} invitationId={invitation} />
                ))}
            </div>
          </div>
        ))}
    </main>
  );
};

export { GenerateInvitation };
