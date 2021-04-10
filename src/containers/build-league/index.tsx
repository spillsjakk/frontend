import { Button, Grid, Select, TextField } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../components/translated";
import { useLeagueForm } from "../../context/build-league-form";
import { fetchJson } from "../../functions";
import style from "./style.module.scss";
import { useOrgsClubs } from "../../hocs/user-orgs-and-clubs/index";

type Props = {};

function generateId(length: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function SelectClubOrg() {
  const [type, setType] = useState("organization");
  const form = useLeagueForm();
  const { orgs, clubs } = useOrgsClubs();
  return (
    <div className={style.content}>
      <div className={style.inputs}>
        <Select
          onChange={(e) => {
            const value = e.target.value;
            if (orgs.find((org) => org.id === value)) {
              setType("organization");
              form.changeOrganization(value as string);
            } else {
              setType("club");
              form.changeClub(value as string);
            }
          }}
          variant="outlined"
          value={type === "organization" ? form.organization : form.club}
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

const BuildLeagueContainer: FunctionComponent<Props> = () => {
  const form = useLeagueForm();

  useEffect(() => {
    if (form && !form.id) {
      form.changeId(generateId(8));
    }
  }, []);

  function create() {
    fetchJson(
      `/s/leagues`,
      "POST",
      {
        id: form.id,
        visible: form.visible,
        name: form.name,
        description: form.description,
        banner_picture: form.bannerPicture,
        profile_picture: form.profilePicture,
        organization: form.organization || undefined,
        club: form.club || undefined,
      },
      (result) => {
        window.location.assign(`/league/view/${form.id}`);
      }
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create();
      }}
    >
      <div id={style.heading}>
        {Translated.byKey("buildLeague").toUpperCase()}
      </div>
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
                  if (pattern.test(e.target.value))
                    form.changeId(e.target.value);
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
            <Grid item xs={12}>
              <SelectClubOrg />
            </Grid>
          </Grid>
        </div>
      </div>
      <Button
        className={style.action}
        variant="contained"
        color="secondary"
        type="submit"
      >
        {Translated.byKey("create")}
      </Button>
    </form>
  );
};
export { BuildLeagueContainer };
