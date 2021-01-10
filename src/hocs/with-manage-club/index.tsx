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

const WithManageClub: FunctionComponent<{}> = ({ children }) => {
  const [club, setClub] = useState<Club>({} as any);
  async function fetchClubData() {
    return new Promise((resolve, reject) => {
      fetchJson("/s/club/manage", "GET", undefined, (result) => {
        if (Array.isArray(result) && result.length > 0) {
          setClub(result[0]);
          const id = result[0].id;
          Promise.all([fetchTeams(id), fetchMembers(id)]).then(
            ([teams, members]) => {
              const values: any = {};
              if (teams) {
                values.teams = teams;
              }

              if (members) {
                values.members = members;
              }

              setClub({ ...result[0], ...values });
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
