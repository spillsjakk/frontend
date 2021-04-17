import React, { FunctionComponent, memo } from "react";
import style from "./style.module.scss";
import Translated from "../../../components/translated/index";
import { WithLeagueForm, useLeagueForm } from "../build/with-form";
import { usePopup, WithPopup } from "../../../hocs/popup";
import { Button, Grid, TextField } from "@material-ui/core";
import { fetchJson } from "../../../functions";
import { SelectClubOrg } from "../build/select-clubs-orgs";
import { useLeague } from "../../../hocs/with-league/index";

const LeagueEditForm: FunctionComponent<{}> = () => {
  const form = useLeagueForm();
  const { fetchLeague } = useLeague();
  const popup = usePopup();

  function create() {
    fetchJson(
      `/s/leagues/${form.id}`,
      "PUT",
      {
        visible: form.visible,
        name: form.name,
        description: form.description,
        banner_picture: form.bannerPicture,
        profile_picture: form.profilePicture,
        organization: form.organization || undefined,
        club: form.club || undefined,
      },
      () => {
        popup.changeOpen(false);
        fetchLeague();
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
      <Heading translateKey="editLeague" />
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
                disabled
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
              <SelectClubOrg disabled={true} />
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
        {Translated.byKey("edit")}
      </Button>
    </form>
  );
};

const Heading: FunctionComponent<{ translateKey: string }> = ({
  translateKey,
}) => {
  return (
    <div id={style.heading}>
      {Translated.byKey(translateKey)
        ? Translated.byKey(translateKey).toUpperCase()
        : ""}
    </div>
  );
};

const EditLeague: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();
  const { league } = useLeague();
  const form = useLeagueForm();

  return (
    <Button
      variant="outlined"
      color="primary"
      className={style["absolute-right"]}
      onClick={() => {
        form.fillValues(league);
        popup.changeOpen(true);
      }}
    >
      {Translated.byKey("editLeague")}
    </Button>
  );
});

const League: FunctionComponent<{}> = () => {
  return (
    <>
      <WithLeagueForm>
        <WithPopup content={<LeagueEditForm />}>
          <EditLeague />
        </WithPopup>
      </WithLeagueForm>
    </>
  );
};

export { League };
