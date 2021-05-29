import React, { useEffect } from "react";
import {
  FormControlLabel,
  Radio,
  Select,
  TextField,
  Grid,
  Slider,
  Typography,
  Checkbox,
  InputLabel,
} from "@material-ui/core";
import { useTemplate } from "../../context/build-tournament-template";
import style from "./style.module.scss";
import { DateTimePicker } from "@material-ui/pickers";
import { useForm } from "../../hocs/tournament-form";
import { KIND } from "../../constants";
import Translated from "../../components/translated";
import { TiebreakerDropdownV2 } from "../../components/tie-breaker-dropdown";
import { useOrgsClubs } from "../../hocs/user-orgs-and-clubs";
import { generateId } from "../../functions";
import { Editor } from "../../components/markdown";

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
          ampm={false}
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
              min={1}
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
            <InputLabel>{Translated.byKey("description")}</InputLabel>
            <Editor
              value={form.description}
              onChange={(value) => form.changeDescription(value)}
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
          ampm={false}
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
            <Grid item>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="secondary"
                    checked={form.chatEnabled}
                    onChange={(e) => {
                      form.changeChatEnabled(e.target.checked);
                    }}
                  />
                }
                label={<Translated str="chatEnabled" />}
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

export {
  TemplateSelection,
  StartDate,
  TournamentLocation,
  About,
  TimeControl,
  StartDateInterval,
  Format,
  Advanced,
  SelectClubOrg,
};
