import React, { FunctionComponent, useEffect, useState } from "react";
import { Organization, OrganizationProvider } from "../../context/organization";
import { useTournamentDetail } from "../../context/tournament-detail";

const WithOrganization: FunctionComponent<{}> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization>();

  const { tournament } = useTournamentDetail();

  async function fetchOrganization(organizer: string) {
    const response = await fetch(`/s/organization/account/${organizer}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: undefined,
    });
    const body = await response.json();
    if (body) {
      setOrganization(body);
    }
  }

  useEffect(() => {
    if (tournament && tournament.organizer) {
      fetchOrganization(tournament.organizer);
    }
  }, [tournament]);

  return (
    <OrganizationProvider value={organization || {}}>
      {children}
    </OrganizationProvider>
  );
};
export { WithOrganization };
