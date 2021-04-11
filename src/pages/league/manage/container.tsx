import DateFnsUtils from "@date-io/date-fns";
import { Button, Grid, TextField } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { FunctionComponent, memo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import { WithPopup } from "../../../hocs/popup";
import { usePopup } from "../../../hocs/popup/index";
import style from "./style.module.scss";
import { useSeasonForm } from "./with-season-form";

const Id: FunctionComponent<{
  change: (value: string) => void;
  value: string;
}> = memo(({ change, value }) => (
  <Grid item xs={6}>
    <TextField
      label={Translated.byKey("id")}
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => {
        const pattern = /^[A-Za-z0-9_-]*$/;
        if (pattern.test(e.target.value)) change(e.target.value);
      }}
      required
    />
  </Grid>
));

const Name: FunctionComponent<{
  change: (value: string) => void;
  value: string;
}> = memo(({ change, value }) => (
  <Grid item xs={6}>
    <TextField
      label={Translated.byKey("name")}
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => change(e.target.value)}
      required
    />
  </Grid>
));

const Description: FunctionComponent<{
  change: (value: string) => void;
  value: string;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <TextField
      label={Translated.byKey("description")}
      fullWidth
      variant="outlined"
      multiline
      value={value}
      onChange={(e) => change(e.target.value)}
      required
    />
  </Grid>
));

const StartDate: FunctionComponent<{
  change: (value: Date) => void;
  value: Date;
}> = memo(({ change, value }) => (
  <Grid item xs={6}>
    <DateTimePicker
      variant="dialog"
      required
      label={Translated.byKey("startDate")}
      value={value}
      onChange={(value: Date) => {
        change(value);
      }}
    />
  </Grid>
));

const EndDate: FunctionComponent<{
  change: (value: Date) => void;
  value: Date;
}> = memo(({ change, value }) => (
  <Grid item xs={6}>
    <DateTimePicker
      variant="dialog"
      required
      label={Translated.byKey("endDate")}
      value={value}
      onChange={(value: Date) => {
        change(value);
      }}
    />
  </Grid>
));

const SeasonForm: FunctionComponent<unknown> = () => {
  const form = useSeasonForm();
  const popup = usePopup();
  const { leagueId } = useParams<{ leagueId: string }>();

  useEffect(() => {
    if (form && !form.id) {
      form.changeId(generateId(8));
    }
  }, []);

  function create() {
    fetchJson(
      `/s/leagues/${leagueId}/seasons`,
      "POST",
      {
        id: form.id,
        visible: form.visible,
        name: form.name,
        description: form.description,
        start_date: form.startDate,
        end_date: form.endDate,
      },
      () => {
        popup.changeOpen(false);
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
        {Translated.byKey("createSeason").toUpperCase()}
      </div>
      <div className={style.content}>
        <div className={style.inputs}>
          <Grid container spacing={3}>
            <Name
              change={useCallback((value) => form.changeName(value), [])}
              value={form.name}
            />
            <Id
              change={useCallback((value) => form.changeId(value), [])}
              value={form.id}
            />
            <Description
              change={useCallback((value) => form.changeDescription(value), [])}
              value={form.description}
            />
            <StartDate
              change={useCallback((value) => form.changeStartDate(value), [])}
              value={form.startDate}
            />
            <EndDate
              change={useCallback((value) => form.changeEndDate(value), [])}
              value={form.endDate}
            />
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

const Season: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();
  return (
    <>
      <Button onClick={() => popup.changeOpen(true)}>Add Season</Button>
    </>
  );
});

const Container: FunctionComponent<unknown> = () => {
  return (
    <WithPopup
      content={
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SeasonForm />
        </MuiPickersUtilsProvider>
      }
    >
      <Season />
    </WithPopup>
  );
};
export { Container };
