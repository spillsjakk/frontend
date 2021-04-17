import { Button, Grid, TextField } from "@material-ui/core";
import React, { FunctionComponent, useEffect } from "react";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import style from "./style.module.scss";
import { SelectClubOrg } from "./select-clubs-orgs";
import { useLeagueForm } from "./with-form";

type Props = {};

const Form: FunctionComponent<Props> = () => {
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
      () => {
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

export { Form };
