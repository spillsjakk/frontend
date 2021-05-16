import React, { FunctionComponent, useCallback, useState } from "react";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { KIND } from "../../constants";
import { useForm } from "../../context/build-tournament-form";
import { TemplateProvider } from "../../context/build-tournament-template";
import { generateId } from "../../functions";

const templates = [
  {
    name: "9 rounds Swiss 3 minutes + 2 seconds",
    value: 1,
  },
  {
    name: "6 rounds rapid Swiss 15 minutes + 10 seconds",
    value: 2,
  },
  {
    name: "4 rounds rapid SkoleSjakken 10 minutes + 0 seconds",
    value: 3,
  },
];

const templateData = [
  {
    id: 1,
    initialTime: 3,
    increment: 2,
    numberOfRounds: 9,
    kind: KIND.SwissDutch,
    kindName: "swissDutch",
  },
  {
    id: 2,
    initialTime: 15,
    increment: 10,
    numberOfRounds: 6,
    kind: KIND.SwissDutch,
    kindName: "swissDutch",
  },
  {
    id: 3,
    initialTime: 10,
    increment: 0,
    numberOfRounds: 4,
    kind: KIND.TeamMonrad,
    kindName: "teamMonrad",
  },
];

export const placeholder = {
  name: "Please Select a Template",
  value: 0,
};

const WithBuildTournamentTemplate: FunctionComponent = ({ children }) => {
  const { user } = useUser();
  const form = useForm();
  const [selectedTemplate, setSelectedTemplate] = useState(placeholder.value);

  const onSelect = useCallback(
    (value: number) => {
      const template = templateData.find((data) => value === data.id);
      if (!template) {
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
    [user]
  );

  return (
    <TemplateProvider
      value={{
        selectedTemplate,
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
