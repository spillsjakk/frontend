// THIS COMPONENT IS NOT IN USE, IT IS THE NEW COMPONENT WHICH IS UNDER DEVELOPMENT

import React, { FunctionComponent, useState } from "react";
import { useEffect } from "react-router/node_modules/@types/react";
import { fetchJson, title } from "../../../functions";
import { useParams } from "react-router-dom";
import { TournamentProvider } from "../../../context/tournament";
import { TournamentParticipantsProvider } from "../../../context/tournament-participants";
import { WithTournamentRound } from "../../../hocs/tournament-round";
import { WithTournamentPairing } from "../../../hocs/tournament-pairing";
import { WithRoundSetupPopup } from "../../../hocs/with-round-setup-popup";
import { Helmet } from "react-helmet";
import {
  LightGame,
  Pairing,
  Participant,
  Team,
  TeamParticipant,
  TKOSeparation,
  Tournament,
} from "../Types";

type TournamentInfo = {
  tournament: Tournament;
  participants: Participant[];
  pairings: Pairing[];
  teams: TeamParticipant[];
  is_team_tournament: boolean;
  managed_teams?: Team[];
  can_start: boolean;
  games: { [id: string]: LightGame[] };
  tko_separation?: { [id: string]: TKOSeparation };
  self_join_teams?: Team[];
  is_participating: boolean;
  organiser_name: string;
  ssw?: string[];
};

const Manage: FunctionComponent<unknown> = () => {
  const [info, setInfo] = useState<TournamentInfo>();
  const [loading, setLoading] = useState(false);
  const { tid } = useParams<{ tid: string }>();
  function fetchTournament() {
    setLoading(true);
    fetchJson("/s/tournament/view/" + tid, "GET", undefined, (json) => {
      setInfo(json);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchTournament();
  }, []);

  return (
    <TournamentProvider value={{ tournament: info?.tournament }}>
      <TournamentParticipantsProvider
        value={{ participants: info?.participants || [] }}
      >
        <WithTournamentRound>
          <WithTournamentPairing>
            <WithRoundSetupPopup>
              <Helmet>
                <title>{title(info?.tournament.name || "tournament")}</title>
              </Helmet>
            </WithRoundSetupPopup>
          </WithTournamentPairing>
        </WithTournamentRound>
      </TournamentParticipantsProvider>
    </TournamentProvider>
  );
};

export { Manage };
