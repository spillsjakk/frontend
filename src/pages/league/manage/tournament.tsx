import React, { FunctionComponent, useState, memo } from "react";
import {
  NativeSelect,
  Grid,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { useTemplate } from "../../../context/build-tournament-template";
import style from "./style.module.scss";
import {
  FormContext,
  useForm,
  WithTournamentForm,
} from "../../../hocs/tournament-form";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";

import { WithBuildTournamentTemplate } from "../../../hocs/build-tournament-template";
import { usePopup, WithPopup } from "../../../hocs/popup";
import { useLeague } from "../../../hocs/with-league/index";
import { Card } from "../../../components/tournament-card/card";
import {
  TemplateSelection,
  About,
  SelectClubOrg,
  StartDate,
  TournamentLocation,
  StartDateInterval,
  Format,
  TimeControl,
  Advanced,
} from "../../Tournament/build/inputs";

function SeasonAndCategory() {
  const form = useForm();
  const { seasons, categories } = useLeague();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <NativeSelect
              onChange={(e) => form.changeSeason(e.target.value as string)}
              variant="outlined"
              value={form.season}
              required
            >
              <option value="" disabled>
                {Translated.byKey("pleaseSelect")}
              </option>
              {Array.isArray(seasons) &&
                seasons.map((season) => (
                  <option value={season.id} key={season.name}>
                    {season.name}
                  </option>
                ))}
            </NativeSelect>
          </Grid>
          <Grid item xs={12} md={6}>
            <NativeSelect
              onChange={(e) => form.changeCategory(e.target.value as string)}
              variant="outlined"
              value={form.category}
              required
            >
              <option value="" disabled>
                {Translated.byKey("pleaseSelect")}
              </option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option value={category.id} key={category.name}>
                    {category.name}
                  </option>
                ))}
            </NativeSelect>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function ActionButtons({
  onLeftClick = () => {},
  onRightClick = () => {},
  leftText = Translated.byKey("back"),
  rightText = Translated.byKey("next"),
  rightDisabled = false,
  leftDisabled = false,
}: {
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftText?: string;
  rightText?: string;
  rightDisabled?: boolean;
  leftDisabled?: boolean;
}) {
  return (
    <div className={style.actions}>
      <Button onClick={onLeftClick} disabled={leftDisabled}>
        {leftText}
      </Button>
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
      season: form.season,
      category: form.category,
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
    season: form.season,
    category: form.category,
    chat_enabled: form.chatEnabled,
    remove_inactive_participants: form.removeInactive,
  };

  return fetchJson(`/s/tournament/build`, "POST", body, (result) => {
    window.location.assign(`/tournament/view/${result.id}`);
  });
}

function TemplateForm(props: { onCustom: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const { selectedTemplate } = useTemplate();
  const form = useForm();
  const league = useLeague();

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
          <Label text={Translated.byKey("seasonAndCategory")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <SeasonAndCategory />
            <ActionButtons leftDisabled />
          </form>
        </StepContent>
      </Step>
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
            onRightClick={async () => {
              await buildTournament(form);
              league.fetchTournaments();
            }}
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
          <Label text={Translated.byKey("seasonAndCategory")} />
        </StepLabel>
        <StepContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <SeasonAndCategory />
            <ActionButtons leftDisabled onLeftClick={previous} />
          </form>
        </StepContent>
      </Step>
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

const AddTournament: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();

  return (
    <Button
      variant="contained"
      color="primary"
      className={style["m-tb-1"]}
      onClick={() => {
        popup.changeOpen(true);
      }}
    >
      {Translated.byKey("buildTournament")}
    </Button>
  );
});

const Tournaments: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();

  return (
    <>
      <div className={style["tournament-row"]}>
        {league &&
          league.tournaments &&
          Array.isArray(Object.keys(league.tournaments)) &&
          Object.keys(league.tournaments).map((season, i) => (
            <div key={i}>
              <div className={style.heading}>{season}</div>
              <div className={style.content} key={i}>
                {league.tournaments[season].map((tournament, i) => (
                  <div key={i}>
                    <Card
                      id={tournament.id}
                      name={tournament.name}
                      timeControl={tournament.online_pairing_interval_n}
                      timeControlInterval={tournament.online_pairing_interval_t}
                      format={tournament.kind}
                      rounds={tournament.rounds}
                      startDate={tournament.first_online_pairing}
                      profile={tournament.profile_picture}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
});

const Tournament: FunctionComponent<unknown> = memo(() => {
  return (
    <WithTournamentForm>
      <WithBuildTournamentTemplate>
        <WithPopup
          content={<FormStepper />}
          dialogProps={{ fullWidth: true, maxWidth: "lg" }}
        >
          <div>
            <AddTournament />
            <Tournaments />
          </div>
        </WithPopup>
      </WithBuildTournamentTemplate>
    </WithTournamentForm>
  );
});

export { Tournament };
