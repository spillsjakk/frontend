import React, { FunctionComponent, useEffect, useState } from "react";
import { fetchJson } from "../../functions";
import { Organization, OrganizationProvider } from "../../context/organization";

function fetchClub(id: string) {
  return fetch(`/s/organization/clubs/${id}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status < 400) {
      return response.json();
    }
  });
}

function fetchAccounts(id: string) {
  return fetch(`/s/organization/all-accounts/${id}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status < 400) {
      return response.json();
    }
  });
}

const WithManageOrganization: FunctionComponent<{ id: string }> = ({
  children,
  id,
}) => {
  const [organization, setOrganization] = useState<Organization>({} as any);
  async function fetchOrganizationData() {
    return new Promise((resolve, reject) => {
      fetchJson(`/s/organization/manage/${id}`, "GET", undefined, (result) => {
        if (result) {
          setOrganization(result);
          const id = result.id;
          Promise.all([fetchClub(id), fetchAccounts(id)]).then(
            ([clubs, accounts]) => {
              const values: any = {};
              if (clubs) {
                values.clubs = clubs;
              }

              if (accounts) {
                values.accounts = accounts;
              }

              setOrganization({ ...result, ...values });
              resolve({});
            }
          );
        } else {
          reject(new Error("Fetch organization error"));
        }
      });
    });
  }
  useEffect(() => {
    try {
      fetchOrganizationData();
    } catch (e) {
      console.error(e);
    }
  }, []);
  function updateData() {
    fetchOrganizationData();
  }
  return (
    <OrganizationProvider value={{ ...organization, updateData }}>
      {children}
    </OrganizationProvider>
  );
};

export { WithManageOrganization };
