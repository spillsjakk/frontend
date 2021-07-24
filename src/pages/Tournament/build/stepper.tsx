import React, { FunctionComponent, useState } from "react";
import {
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import style from "./style.module.scss";
import {
  TemplateSelection,
  StartDate,
  TournamentLocation,
  About,
  TimeControl,
  StartDateInterval,
  Format,
  Advanced,
  SelectClubOrg,
} from "./inputs";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { useTemplate } from "../../../context/build-tournament-template";
import { FormContext, useForm } from "../../../hocs/tournament-form";
import { fetchJson } from "../../../functions";
import Translated from "../../../components/translated";

function ActionButtons({
  onLeftClick,
  onRightClick = () => {},
  leftText = Translated.byKey("back"),
  rightText = Translated.byKey("next"),
  rightDisabled = false,
}: {
  onLeftClick: () => void;
  onRightClick?: () => void;
  leftText?: string;
  rightText?: string;
  rightDisabled?: boolean;
}) {
  return (
    <div className={style.actions}>
      <Button onClick={onLeftClick}>{leftText}</Button>
      <Button
        className={style["ml-lg"]}
        disabled={rightDisabled}
        variant="contained"
        color="secondary"
        onClick={onRightClick}
        type="submit"
      >
        {rightText}
      </Button>
    </div>
  );
}

function SaveButton(props: { form: FormContext }) {
  const form = props.form;
  function save() {
    const body = {
      id: form.id,
      name: form.name,
      description: form.description,
      kind: form.kind,
      default_game_location: form.defaultGameLocation,
      start_date: form.startDate,
      end_date: form.endDate,
      publicly_viewable: form.publiclyViewable,
      first_pairing_date: form.firstPairingDate,
      first_pairing_time: form.firstPairingTime,
      online_pairing_interval_n: form.onlinePairingIntervalN,
      online_pairing_interval_t: form.onlinePairingIntervalT,
      initial_time: form.initialTime,
      increment: form.increment,
      self_joinable: form.selfJoinable,
      show_only_top: form.showOnlyTop,
      show_only_top_nr: form.showOnlyTopNr,
      win_points: form.winPoints,
      draw_points: form.drawPoints,
      loss_points: form.lossPoints,
      tb1: form.tb1 !== "" ? parseInt(form.tb1!, 10) : undefined,
      tb2: form.tb2 !== "" ? parseInt(form.tb2!, 10) : undefined,
      tb3: form.tb3 !== "" ? parseInt(form.tb3!, 10) : undefined,
      tb4: form.tb4 !== "" ? parseInt(form.tb4!, 10) : undefined,
      rounds: form.rounds,
      fide_rated: form.fideRated,
      per_team: form.perTeam,
      show_only_usernames: form.showOnlyUsernames,
      profile_picture: form.profilePicture,
      banner_picture: form.bannerPicture,
      organiser: form.organiser,
      organiser_type: form.organiserType,
      chat_enabled: form.chatEnabled,
      remove_inactive_participants: form.removeInactive,
    };

    fetchJson(`/s/tournament/template/save`, "POST", body, () => {});

    fetchJson(`/s/tournament/build`, "POST", body, (result) => {
      window.location.assign(`/tournament/view/${result.id}`);
    });
  }
  return (
    <Button
      className={style.save}
      onClick={() => save()}
      variant="contained"
      color="primary"
    >
      {Translated.byKey("saveAndCreate")}
    </Button>
  );
}

function Label({ text }: { text: string }) {
  return <div className={style.heading}>{text}</div>;
}

function buildTournament(form: FormContext) {
  const body = {
    id: form.id,
    name: form.name,
    description: form.description,
    kind: form.kind,
    default_game_location: form.defaultGameLocation,
    start_date: form.startDate,
    end_date: form.endDate,
    publicly_viewable: form.publiclyViewable,
    first_pairing_date: form.firstPairingDate,
    first_pairing_time: form.firstPairingTime,
    online_pairing_interval_n: form.onlinePairingIntervalN,
    online_pairing_interval_t: form.onlinePairingIntervalT,
    initial_time: form.initialTime,
    increment: form.increment,
    self_joinable: form.selfJoinable,
    show_only_top: form.showOnlyTop,
    show_only_top_nr: form.showOnlyTopNr,
    win_points: form.winPoints,
    draw_points: form.drawPoints,
    loss_points: form.lossPoints,
    tb1: form.tb1 !== "" ? parseInt(form.tb1!, 10) : undefined,
    tb2: form.tb2 !== "" ? parseInt(form.tb2!, 10) : undefined,
    tb3: form.tb3 !== "" ? parseInt(form.tb3!, 10) : undefined,
    tb4: form.tb4 !== "" ? parseInt(form.tb4!, 10) : undefined,
    rounds: form.rounds,
    fide_rated: form.fideRated,
    per_team: form.perTeam,
    show_only_usernames: form.showOnlyUsernames,
    profile_picture: form.profilePicture,
    banner_picture: form.bannerPicture,
    organiser: form.organiser,
    organiser_type: form.organiserType,
    chat_enabled: form.chatEnabled,
    remove_inactive_participants: form.removeInactive,
  };

  fetchJson(`/s/tournament/build`, "POST", body, (result) => {
    window.location.assign(`/tournament/view/${result.id}`);
  });
}

function TemplateForm(props: { onCustom: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const { selectedTemplate } = useTemplate();
  const form = useForm();

  function next() {
    setActiveStep(activeStep + 1);
  }

  function previous() {
    setActiveStep(activeStep - 1);
  }

  return (
    <Stepper activeStep={activeStep} id={style.stepper} orientation="vertical">
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_templateSelection")} />
        </StepLabel>
        <StepContent>
          <TemplateSelection />
          <div className={style.actions}>
            <Button
              onClick={() => props.onCustom()}
              variant="contained"
              color="secondary"
            >
              {Translated.byKey("customSettings")}
            </Button>
            <Button
              className={style["ml-lg"]}
              disabled={!selectedTemplate}
              variant="contained"
              color="primary"
              onClick={() => next()}
            >
              {Translated.byKey("nextWithTemplate")}
            </Button>
          </div>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("organiser")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <SelectClubOrg />
            <ActionButtons onLeftClick={previous} />
          </form>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("startDate")} />
        </StepLabel>
        <StepContent>
          <StartDate />
          <ActionButtons onRightClick={next} onLeftClick={previous} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_location")} />
        </StepLabel>
        <StepContent>
          <TournamentLocation />
          <ActionButtons
            onRightClick={() => buildTournament(form)}
            onLeftClick={props.onCustom}
            rightText={Translated.byKey("create")}
            leftText={Translated.byKey("buildTournament_reviewAll")}
          />
          <SaveButton form={form} />
        </StepContent>
      </Step>
    </Stepper>
  );
}

function Form(props: { onTemplate: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm();

  function next() {
    setActiveStep(activeStep + 1);
  }

  function previous() {
    setActiveStep(activeStep - 1);
  }

  return (
    <Stepper activeStep={activeStep} id={style.stepper} orientation="vertical">
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("about")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <About />
            <ActionButtons
              onLeftClick={props.onTemplate}
              leftText={Translated.byKey("buildTournament_useTemplate")}
            />
          </form>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("organiser")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <SelectClubOrg />
            <ActionButtons onLeftClick={previous} />
          </form>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_location")} />
        </StepLabel>
        <StepContent>
          <TournamentLocation />
          <ActionButtons onRightClick={next} onLeftClick={previous} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_startDateTime")} />
        </StepLabel>
        <StepContent>
          <StartDateInterval />
          <ActionButtons onRightClick={next} onLeftClick={previous} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_format")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <Format />
            <ActionButtons onLeftClick={previous} />
          </form>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_timeControl")} />
        </StepLabel>
        <StepContent>
          <TimeControl />
          <ActionButtons onRightClick={next} onLeftClick={previous} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Label text={Translated.byKey("buildTournament_privacyAdvanced")} />
        </StepLabel>
        <StepContent>
          <Advanced />
          <ActionButtons
            onRightClick={() => buildTournament(form)}
            onLeftClick={previous}
            rightText={Translated.byKey("create")}
          />
          <SaveButton form={form} />
        </StepContent>
      </Step>
    </Stepper>
  );
}

enum FormType {
  TEMPLATE,
  ALL,
}

const FormStepper: FunctionComponent<{}> = () => {
  const [formType, setFormType] = useState(FormType.TEMPLATE);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        {formType === FormType.TEMPLATE && (
          <TemplateForm onCustom={() => setFormType(FormType.ALL)} />
        )}
        {formType === FormType.ALL && (
          <Form onTemplate={() => setFormType(FormType.TEMPLATE)} />
        )}
      </>
    </LocalizationProvider>
  );
};

export { FormStepper };
