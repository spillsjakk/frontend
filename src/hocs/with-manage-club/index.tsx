import React, { FunctionComponent, useEffect, useState } from "react";
import { fetchJson } from "../../functions";
import { Club, ClubProvider } from "../../context/club";

function fetchTeams(id: string) {
  return fetch(`/s/club/teams/${id}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status < 400) {
      return response.json();
    }
  });
}

function fetchMembers(id: string) {
  return fetch(`/s/club/members/${id}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status < 400) {
      return response.json();
    }
  });
}

const WithManageClub: FunctionComponent<{ id: string }> = ({
  children,
  id,
}) => {
  const [club, setClub] = useState<Club>({} as any);
  async function fetchClubData() {
    return new Promise((resolve, reject) => {
      fetchJson(`/s/club/manage/${id}`, "GET", undefined, (result) => {
        if (result) {
          setClub(result);
          const id = result.id;
          Promise.all([fetchTeams(id), fetchMembers(id)]).then(
            ([teams, members]) => {
              const values: any = {};
              if (teams) {
                values.teams = teams;
              }

              if (members) {
                values.members = members;
              }

              setClub({ ...result, ...values });
              resolve({});
            }
          );
        } else {
          reject(new Error("Fetch club error"));
        }
      });
    });
  }
  useEffect(() => {
    try {
      fetchClubData();
    } catch (e) {
      console.error(e);
    }
  }, []);
  function updateData() {
    fetchClubData();
  }
  return (
    <ClubProvider value={{ ...club, updateData }}>{children}</ClubProvider>
  );
};

export { WithManageClub };
