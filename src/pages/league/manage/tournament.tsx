import React, { useEffect, FunctionComponent, useState, memo } from "react";
import {
  FormControlLabel,
  Radio,
  Select,
  TextField,
  Grid,
  Slider,
  Typography,
  Checkbox,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { useTemplate } from "../../../context/build-tournament-template";
import style from "./style.module.scss";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FormContext, useForm } from "../../../context/build-tournament-form";
import { KIND } from "../../../constants";
import Translated from "../../../components/translated";
import { TiebreakerDropdownV2 } from "../../../components/tie-breaker-dropdown";
import { useOrgsClubs } from "../../../hocs/user-orgs-and-clubs";
import { generateId, fetchJson } from "../../../functions";

import DateFnsUtils from "@date-io/date-fns";
import { WithTournamentForm } from "../../../hocs/tournament-form";
import { WithBuildTournamentTemplate } from "../../../hocs/build-tournament-template";
import { usePopup, WithPopup } from "../../../hocs/popup";
import { useLeague } from "../../../hocs/with-league/index";
import { Card } from "../../../components/tournament-card/card";

function TemplateSelection() {
  const { templates, onSelect, placeholder, selectedTemplate } = useTemplate();
  return (
    <div className={style.content}>
      <div className={style.description}>
        <Translated str="buildTournament_chooseTemplateDesc" />
      </div>
      <div className={style.inputs}>
        <Select
          onChange={(e) => onSelect(Number(e.target.value))}
          variant="outlined"
          value={selectedTemplate}
          native
        >
          <option value={placeholder.value}>{placeholder.name}</option>
          {Array.isArray(templates) &&
            templates.map((template) => (
              <option value={template.value} key={template.value}>
                {template.name}
              </option>
            ))}
        </Select>
      </div>
    </div>
  );
}

function StartDate() {
  const form = useForm();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <DateTimePicker
          variant="inline"
          required
          label={Translated.byKey("startDate")}
          value={
            new Date(
              `${form.firstPairingDate}T${
                form.firstPairingTime || "00:00"
              }:00.000Z`
            )
          }
          onChange={(value: Date) => {
            const dateString = value.toISOString().slice(0, 10);
            form.changeStartDate(dateString);
            form.changeEndDate(dateString);
            form.changeFirstPairingDate(dateString);
            form.changeFirstPairingTime(value.toISOString().slice(11, 16));
          }}
        />
      </div>
    </div>
  );
}

function TournamentLocation() {
  const form = useForm();
  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <FormControlLabel
          value="real-world"
          control={
            <Radio
              checked={form.defaultGameLocation === 0}
              onChange={() => form.changeDefaultGameLocation(0)}
              value="0"
            />
          }
          label={Translated.byKey("realWorld")}
          labelPlacement="top"
        />
        <FormControlLabel
          value="online"
          control={
            <Radio
              checked={form.defaultGameLocation === 1}
              onChange={() => form.changeDefaultGameLocation(1)}
              value="1"
            />
          }
          label={Translated.byKey("online")}
          labelPlacement="top"
        />
      </div>
    </div>
  );
}

function TimeControl() {
  const form = useForm();
  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography gutterBottom>
              <Translated str="buildTournament_timeAllowance" />
            </Typography>
            <Slider
              className={style["mt-xl"]}
              value={form.initialTime}
              valueLabelDisplay="on"
              onChange={(e, value) => form.changeInitialTime(value as number)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom>
              <Translated str="buildTournament_timeAdded" />
            </Typography>
            <Slider
              className={style["mt-xl"]}
              value={form.increment}
              valueLabelDisplay="on"
              onChange={(e, value) => form.changeIncrement(value as number)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function SeasonAndCategory() {
  const form = useForm();
  const { seasons, categories } = useLeague();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Select
              onChange={(e) => form.changeSeason(e.target.value as string)}
              variant="outlined"
              value={form.season}
              native
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
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              onChange={(e) => form.changeCategory(e.target.value as string)}
              variant="outlined"
              value={form.category}
              native
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
            </Select>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function About() {
  const form = useForm();
  useEffect(() => {
    if (form && !form.id) {
      form.changeId(generateId(8));
    }
  }, []);
  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              label={Translated.byKey("name")}
              fullWidth
              variant="outlined"
              value={form.name}
              onChange={(e) => form.changeName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={Translated.byKey("id")}
              fullWidth
              variant="outlined"
              value={form.id}
              onChange={(e) => {
                const pattern = /^[A-Za-z0-9_-]*$/;
                if (pattern.test(e.target.value)) form.changeId(e.target.value);
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={Translated.byKey("banner_picture")}
              fullWidth
              variant="outlined"
              value={form.bannerPicture}
              onChange={(e) => form.changeBannerPicture(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={Translated.byKey("profile_picture")}
              fullWidth
              variant="outlined"
              value={form.profilePicture}
              onChange={(e) => form.changeProfilePicture(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={Translated.byKey("description")}
              fullWidth
              variant="outlined"
              multiline
              value={form.description}
              onChange={(e) => form.changeDescription(e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function StartDateInterval() {
  const form = useForm();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <DateTimePicker
          variant="inline"
          label={Translated.byKey("startDate")}
          value={
            new Date(
              `${form.firstPairingDate}T${
                form.firstPairingTime || "00:00"
              }:00.000Z`
            )
          }
          onChange={(value: Date) => {
            const dateString = value.toISOString().slice(0, 10);
            form.changeStartDate(dateString);
            form.changeEndDate(dateString);
            form.changeFirstPairingDate(dateString);
            form.changeFirstPairingTime(value.toISOString().slice(11, 16));
          }}
        />
        <TextField
          className={style["ml-lg"]}
          value={form.onlinePairingIntervalN}
          type="number"
          label={Translated.byKey("buildTournament_intervalGames")}
          variant="outlined"
          onChange={(e) =>
            form.changeOnlinePairingIntervalN(Number(e.target.value))
          }
        />
        <Select
          onChange={(e) =>
            form.changeOnlinePairingIntervalT(Number(e.target.value))
          }
          variant="outlined"
          className={style["ml-sm"]}
          value={form.onlinePairingIntervalT}
          native
        >
          <option value={0}>minutes</option>
          <option value={1}>hours</option>
          <option value={2}>days</option>
          <option value={3}>weeks</option>
        </Select>
      </div>
    </div>
  );
}

function Advanced() {
  const pointsSettingEnabled = true;

  const form = useForm();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={2}>
          <Grid item container md={6}>
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.publiclyViewable}
                    onChange={(e) =>
                      form.changePubliclyViewable(e.target.checked)
                    }
                  />
                }
                label={<Translated str="publiclyViewable" />}
                labelPlacement="end"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.selfJoinable}
                    onChange={(e) => form.changeSelfJoinable(e.target.checked)}
                  />
                }
                label={<Translated str="allowSelfJoining" />}
                labelPlacement="end"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.fideRated}
                    onChange={(e) => form.changeFideRated(e.target.checked)}
                  />
                }
                label={<Translated str="fideRated" />}
                labelPlacement="end"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.showOnlyUsernames}
                    onChange={(e) =>
                      form.changeShowOnlyUsernames(e.target.checked)
                    }
                  />
                }
                label={<Translated str="showOnlyUsernames" />}
                labelPlacement="end"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.showOnlyTop}
                    onChange={(e) => {
                      form.changeShowOnlyTopNr(3);
                      form.changeShowOnlyTop(e.target.checked);
                    }}
                  />
                }
                label={<Translated str="onlyShowScoresOfTop3" />}
                labelPlacement="end"
              />
            </Grid>
          </Grid>

          <Grid item container md={6} spacing={2}>
            <Grid item>
              <TextField
                disabled={!pointsSettingEnabled}
                type="number"
                label={<Translated str="winPoints" />}
                variant="outlined"
                value={form.winPoints}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                onChange={(e) => form.changeWinPoints(Number(e.target.value))}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={!pointsSettingEnabled}
                type="number"
                label={<Translated str="drawPoints" />}
                variant="outlined"
                value={form.drawPoints}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                onChange={(e) => form.changeDrawPoints(Number(e.target.value))}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled={!pointsSettingEnabled}
                type="number"
                label={<Translated str="lossPoints" />}
                variant="outlined"
                value={form.lossPoints}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                onChange={(e) => form.changeLossPoints(Number(e.target.value))}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function Format() {
  const form = useForm();

  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Grid container spacing={3}>
          <Grid item container xs={6} spacing={3}>
            <Grid item>
              <Select
                onChange={(e) => form.changeKind(Number(e.target.value))}
                variant="outlined"
                value={form.kind}
                native
                fullWidth
              >
                {Object.keys(KIND).map((kind) => (
                  <option value={KIND[kind]} key={KIND[kind]}>
                    {Translated.byKey(
                      kind.replace(/^.{1}/g, kind[0].toLowerCase())
                    )}
                  </option>
                ))}
              </Select>
            </Grid>
            {![0, 2, 7, 8, 9].includes(form.kind) && (
              <Grid item>
                <TextField
                  type="number"
                  label={<Translated str="roundNb" />}
                  id="rounds"
                  variant="outlined"
                  name="rounds"
                  value={Number(form.rounds)}
                  onChange={(e) => form.changeRounds!(Number(e.target.value))}
                />
              </Grid>
            )}
            {[2, 3, 9].includes(form.kind) && (
              <Grid item>
                <TextField
                  label={<Translated str="membersPerTeam" />}
                  type="number"
                  variant="outlined"
                  id="per_team"
                  name="per_team"
                  required={[2, 3, 9].includes(form.kind)}
                  value={Number(form.perTeam)}
                  onChange={(e) => form.changePerTeam!(Number(e.target.value))}
                />
              </Grid>
            )}
          </Grid>
          <Grid item xs={6}>
            {form.kind === 1 && (
              <Grid container spacing={3}>
                <Grid item>
                  <TiebreakerDropdownV2
                    value={form.tb1 as string}
                    onChange={(e) => form.changeTb1(e.target.value)}
                    id="1"
                    name="tb1"
                  />
                </Grid>

                <Grid item>
                  <TiebreakerDropdownV2
                    value={form.tb2 as string}
                    onChange={(e) => form.changeTb2(e.target.value)}
                    id="2"
                    name="tb2"
                  />
                </Grid>
                <Grid item>
                  <TiebreakerDropdownV2
                    value={form.tb3 as string}
                    onChange={(e) => form.changeTb3(e.target.value)}
                    id="3"
                    name="tb3"
                  />
                </Grid>
                <Grid item>
                  <TiebreakerDropdownV2
                    value={form.tb4 as string}
                    onChange={(e) => form.changeTb4(e.target.value)}
                    id="4"
                    name="tb4"
                  />
                </Grid>
                <br />
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function SelectClubOrg() {
  const form = useForm();
  const { orgs, clubs } = useOrgsClubs();
  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Select
          onChange={(e) => {
            const value = e.target.value;
            if (orgs.find((org) => org.id === value)) {
              form.changeOrganiserType("organization");
            } else {
              form.changeOrganiserType("club");
            }
            form.changeOrganiser(value as string);
          }}
          variant="outlined"
          value={form.organiser}
          native
          required
        >
          <option value="" disabled>
            {Translated.byKey("buildTournament_pleaseSelectOrganiser")}
          </option>
          {Array.isArray(orgs) &&
            orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          {Array.isArray(clubs) &&
            clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
        </Select>
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
            <ActionButtons onLeftClick={previous} />
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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        {formType === FormType.TEMPLATE && (
          <TemplateForm onCustom={() => setFormType(FormType.ALL)} />
        )}
        {formType === FormType.ALL && (
          <Form onTemplate={() => setFormType(FormType.TEMPLATE)} />
        )}
      </>
    </MuiPickersUtilsProvider>
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
