import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { KIND, TIEBREAKER, VARIANT } from "../../constants";
import { TemplateProvider } from "../../context/build-tournament-template";
import { fetchJson, generateId } from "../../functions";
import { useForm } from "../../hocs/tournament-form";
import { Tournament } from "../../pages/Tournament/Types";

export const placeholder = {
  name: Translated.byKey("tournamentTemplatePlaceholder"),
  id: "0",
};

const WithBuildTournamentTemplate: FunctionComponent = ({ children }) => {
  const { user } = useUser();
  const form = useForm();
  const [selectedTemplate, setSelectedTemplate] = useState(placeholder.id);
  const [templates] = useState([
    {
      name: "9 rounds Swiss 3 minutes + 2 seconds",
      id: "1",
      initialTime: 3,
      increment: 2,
      numberOfRounds: 9,
      kind: KIND.SwissDutch,
      kindName: "swissDutch",
    },
    {
      name: "6 rounds rapid Swiss 15 minutes + 10 seconds",
      id: "2",
      initialTime: 15,
      increment: 10,
      numberOfRounds: 6,
      kind: KIND.SwissDutch,
      kindName: "swissDutch",
    },
  ]);
  const [savedTournaments, setSavedTournaments] = useState<Array<Tournament>>(
    []
  );

  useEffect(() => {
    fetchJson(`/s/tournament/template/list`, "GET", undefined, (response) => {
      if (Array.isArray(response)) {
        setSavedTournaments(response);
      }
    });
  }, []);

  const onSelect = useCallback(
    (value: any) => {
      const template = templates.find((data) => value === data.id);
      if (!template) {
        const savedTournament = savedTournaments.find(
          (data) => value === data.id
        );
        if (!savedTournament) {
          return;
        }

        form.changeName(savedTournament.name);
        form.changeDescription(savedTournament.description);
        form.changeId(generateId(7));
        form.changePubliclyViewable(savedTournament.publicly_viewable);
        form.changeSelfJoinable(savedTournament.self_joinable);
        form.changeFideRated(true);
        form.changeKind((KIND as any)[savedTournament.kind]);
        form.changeRounds!(savedTournament.rounds);
        form.changeOnlinePairingIntervalN(5);
        form.changeInitialTime(savedTournament.initial_time);
        form.changeIncrement(savedTournament.increment);
        form.changeOrganiser(savedTournament.organiser);
        form.changeOrganiserType(savedTournament.organiser_type);
        form.changePerTeam(savedTournament.per_team_limit);
        if (savedTournament.tb1) {
          form.changeTb1((TIEBREAKER as any)[savedTournament.tb1]);
        }
        if (savedTournament.tb2) {
          form.changeTb2((TIEBREAKER as any)[savedTournament.tb2]);
        }
        if (savedTournament.tb3) {
          form.changeTb3((TIEBREAKER as any)[savedTournament.tb3]);
        }
        if (savedTournament.tb4) {
          form.changeTb4((TIEBREAKER as any)[savedTournament.tb4]);
        }
        form.changeRemoveInactive(savedTournament.remove_inactive_participants);
        form.changeVariant(VARIANT[savedTournament.game_variant]);
        setSelectedTemplate(value);
        return;
      }

      const name = `${user?.info?.name}: ${Translated.byKey(
        template.kindName
      )} ${template.initialTime}+${template.increment} ${
        template.numberOfRounds
      }-round `;
      form.changeName(name);
      form.changeDescription(name);
      form.changeId(generateId(7));
      form.changePubliclyViewable(true);
      form.changeSelfJoinable(true);
      form.changeFideRated(true);
      form.changeKind(template.kind);
      form.changeRounds!(template.numberOfRounds);
      form.changeOnlinePairingIntervalN(5);
      form.changeInitialTime(template.initialTime);
      form.changeIncrement(template.increment);
      if (template.kind === KIND.SwissDutch) {
        form.changeTb1("0");
        form.changeTb2("1");
        form.changeTb3("2");
        form.changeTb4("3");
      }
      setSelectedTemplate(value);
    },
    [user, templates, savedTournaments]
  );

  return (
    <TemplateProvider
      value={{
        selectedTemplate,
        savedTournaments,
        templates,
        onSelect,
        placeholder,
      }}
    >
      {children}
    </TemplateProvider>
  );
};
export { WithBuildTournamentTemplate };
