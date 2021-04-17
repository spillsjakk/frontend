import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import EditIcon from "@material-ui/icons/Edit";
import React, { FunctionComponent, memo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import { usePopup, WithPopup } from "../../../hocs/popup/index";
import style from "./style.module.scss";
import { FORM_TYPE, useSeasonForm, WithSeasonForm } from "./with-season-form";
import { useLeague, Season as ISeason } from "../../../hocs/with-league/index";

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

const Id: FunctionComponent<{
  change: (value: string) => void;
  value: string;
  disabled: boolean;
}> = memo(({ change, value, disabled }) => (
  <Grid item xs={6}>
    <TextField
      label={Translated.byKey("id")}
      fullWidth
      variant="outlined"
      value={value}
      disabled={disabled}
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
  const league = useLeague();
  const form = useSeasonForm();
  const popup = usePopup();
  const { leagueId } = useParams<{ leagueId: string }>();

  useEffect(() => {
    if (form && !form.id) {
      form.changeId(generateId(8));
    }
  }, []);

  useEffect(() => {
    if (!popup.isOpen) {
      form.resetValues();
    }
  }, [popup.isOpen]);

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
        league.fetchSeasons();
        popup.changeOpen(false);
      }
    );
  }

  function edit() {
    fetchJson(
      `/s/leagues/${leagueId}/seasons/${form.id}`,
      "PUT",
      {
        visible: form.visible,
        name: form.name,
        description: form.description,
        start_date: form.startDate,
        end_date: form.endDate,
      },
      () => {
        league.fetchSeasons();
        popup.changeOpen(false);
      }
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.type === FORM_TYPE.CREATE ? create() : edit();
      }}
    >
      <Heading
        translateKey={
          form.type === FORM_TYPE.CREATE ? "createSeason" : "editSeason"
        }
      />
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
              disabled={form.type === FORM_TYPE.EDIT}
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
        {Translated.byKey(form.type === FORM_TYPE.CREATE ? "create" : "edit")}
      </Button>
    </form>
  );
};

const AddSeason: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();
  const form = useSeasonForm();

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => {
        form.changeType(FORM_TYPE.CREATE);
        popup.changeOpen(true);
      }}
    >
      {Translated.byKey("addSeason")}
    </Button>
  );
});

const SeasonItem: FunctionComponent<{
  item: ISeason;
  edit: (item: ISeason) => void;
}> = memo(({ item, edit }) => {
  return (
    <ListItem disableGutters>
      <ListItemText primary={item.name} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => {
            edit(item);
          }}
        >
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

const SeasonList: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();
  const { changeOpen } = usePopup();
  const { changeType, fillValues } = useSeasonForm();

  const edit = useCallback(
    (item: ISeason) => {
      changeType(FORM_TYPE.EDIT);
      fillValues(item);
      changeOpen(true);
    },
    [changeOpen, changeType, fillValues]
  );

  return (
    <List>
      {league &&
        Array.isArray(league.seasons) &&
        league.seasons.map((item, i) => (
          <SeasonItem item={item} key={i} edit={edit} />
        ))}
    </List>
  );
});

const Season: FunctionComponent<unknown> = memo(() => {
  return (
    <div className={style.season}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <WithSeasonForm>
          <WithPopup content={<SeasonForm />}>
            <Heading translateKey="seasons" />
            <SeasonList />
            <AddSeason />
          </WithPopup>
        </WithSeasonForm>
      </MuiPickersUtilsProvider>
    </div>
  );
});

export { Season, SeasonForm };
