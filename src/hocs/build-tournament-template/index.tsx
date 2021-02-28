import React, { FunctionComponent, useCallback, useState } from "react";
import { useUser } from "../../components/UserContext";
import { useForm } from "../../context/build-tournament-form";
import { TemplateProvider } from "../../context/build-tournament-template";

const templates = [
  {
    name: "90 minutes + 30 seconds / Individual / 9 rounds / Swiss",
    value: 1,
  },
  {
    name: "15 minutes + 10 seconds / Individual / 7 rounds / Swiss",
    value: 2,
  },
  {
    name: "3 minutes + 2 seconds / Individual / 11 rounds / Swiss ",
    value: 3,
  },
];

const templateData = [
  {
    id: 1,
    initialTime: 90,
    increment: 30,
    numberOfRounds: 9,
  },
  {
    id: 2,
    initialTime: 15,
    increment: 10,
    numberOfRounds: 7,
  },
  {
    id: 3,
    initialTime: 3,
    increment: 2,
    numberOfRounds: 11,
  },
];

export const placeholder = {
  name: "Please Select a Template",
  value: 0,
};

function generateId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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

      const name = `${user?.info?.name}: ${template.initialTime}+${template.increment} Individual ${template.numberOfRounds}-round Swiss`;
      form.changeName(name);
      form.changeDescription(name);
      form.changeId(generateId(7));
      form.changePubliclyViewable(true);
      form.changeSelfJoinable(true);
      form.changeFideRated(true);
      form.changeKind(1);
      form.changeRounds!(template.numberOfRounds);
      form.changeOnlinePairingIntervalN(5);
      form.changeInitialTime(template.initialTime);
      form.changeIncrement(template.increment);

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
