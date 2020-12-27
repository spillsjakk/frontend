import React, { FunctionComponent, useEffect, useState } from "react";
import { TournamentProvider } from "../../context/tournament";
import { Tournament } from "../../pages/Tournament/Types";
import { fetchJson } from "../../functions";

interface Props {
  id: string;
}

const WithTournament: FunctionComponent<Props> = ({ id, children }) => {
  const [tournament, setTournament] = useState<Tournament>();
  useEffect(() => {
    fetchJson("/s/tournament/view/" + id, "GET", undefined, (json) => {
      if (json && json.tournament && json.tournament.id) {
        setTournament(json.tournament);
      }
    });
  }, [id]);
  return (
    <TournamentProvider value={{ tournament }}>{children}</TournamentProvider>
  );
};

export { WithTournament };
