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
import { DateTimePicker } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import EditIcon from "@material-ui/icons/Edit";
import TimerOff from "@material-ui/icons/TimerOff";
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import { usePopup, WithPopup } from "../../../hocs/popup/index";
import style from "./style.module.scss";
import { FORM_TYPE, useSeasonForm, WithSeasonForm } from "./with-season-form";
import { useLeague, Season as ISeason } from "../../../hocs/with-league/index";
import MouseOverPopover from "../../../components/popover";
import { PromotionRelegationForm } from "./promotion-relegation";
import { WithPromotionRelegation } from "./with-promotion-relegation";

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
      ampm={false}
      renderInput={(params) => <TextField required {...params} />}
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
      ampm={false}
      renderInput={(params) => <TextField required {...params} />}
      label={Translated.byKey("endDate")}
      value={value}
      onChange={(value: Date) => {
        change(value);
      }}
    />
  </Grid>
));

const SeasonForm: FunctionComponent<{ oldSeasonId?: string }> = (props) => {
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

  function start() {
    fetchJson(
      `/s/leagues/${leagueId}/seasons/start`,
      "POST",
      {
        id: form.id,
        old_season_id: props.oldSeasonId,
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

  function getHeading() {
    let result;
    switch (form.type) {
      case FORM_TYPE.CREATE:
        result = "createSeason";
        break;
      case FORM_TYPE.EDIT:
        result = "editSeason";
        break;
      case FORM_TYPE.START:
        result = "startSeason";
        break;
    }
    return result;
  }

  function getButtonText() {
    let result;
    switch (form.type) {
      case FORM_TYPE.CREATE:
        result = "create";
        break;
      case FORM_TYPE.EDIT:
        result = "edit";
        break;
      case FORM_TYPE.START:
        result = "start";
        break;
    }
    return result;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        switch (form.type) {
          case FORM_TYPE.CREATE:
            create();
            break;
          case FORM_TYPE.EDIT:
            edit();
            break;
          case FORM_TYPE.START:
            start();
            break;
        }
      }}
    >
      <Heading translateKey={getHeading()} />
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
        {getButtonText()}
      </Button>
    </form>
  );
};

const AddSeason: FunctionComponent<{ onAction: () => void }> = memo(
  ({ onAction }) => {
    const popup = usePopup();
    const form = useSeasonForm();

    return (
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          form.changeType(FORM_TYPE.CREATE);
          popup.changeOpen(true);
          onAction();
        }}
      >
        {Translated.byKey("addSeason")}
      </Button>
    );
  }
);

const SeasonItem: FunctionComponent<{
  item: ISeason;
  edit: (item: ISeason) => void;
  end: (item: ISeason) => void;
}> = memo(({ item, edit, end }) => {
  return (
    <ListItem disableGutters>
      <ListItemText primary={item.name} />
      <ListItemSecondaryAction>
        {!item.ended && (
          <IconButton
            onClick={() => {
              end(item);
            }}
          >
            <MouseOverPopover popoverText={<Translated str="end" />}>
              <TimerOff />
            </MouseOverPopover>
          </IconButton>
        )}
        <IconButton
          onClick={() => {
            edit(item);
          }}
        >
          <MouseOverPopover popoverText={<Translated str="edit" />}>
            <EditIcon />
          </MouseOverPopover>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

enum FORM_KIND {
  PROMOTION_RELEGATION,
  SEASON,
}

const SeasonList: FunctionComponent<{
  changeForm: (value: FORM_KIND, item: ISeason) => void;
}> = memo(({ changeForm }) => {
  const league = useLeague();
  const { changeOpen } = usePopup();
  const { changeType, fillValues } = useSeasonForm();

  const edit = useCallback(
    (item: ISeason) => {
      changeForm(FORM_KIND.SEASON, item);
      changeType(FORM_TYPE.EDIT);
      fillValues(item);
      changeOpen(true);
    },
    [changeOpen, changeType, fillValues]
  );
  const end = useCallback((item: ISeason) => {
    changeForm(FORM_KIND.PROMOTION_RELEGATION, item);
    changeOpen(true);
  }, []);

  return (
    <List className={style.list}>
      {league &&
        Array.isArray(league.seasons) &&
        league.seasons.map((item, i) => (
          <SeasonItem item={item} key={i} edit={edit} end={end} />
        ))}
    </List>
  );
});

const Season: FunctionComponent<unknown> = memo(() => {
  const [form, setForm] = useState(<SeasonForm />);
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const league = useLeague();
  const changeForm = useCallback((value: FORM_KIND, item: ISeason) => {
    setSelectedSeasonId(item.id);
    if (value === FORM_KIND.PROMOTION_RELEGATION) {
      setForm(
        <PromotionRelegationForm
          season={item}
          onEnd={() => setForm(<SeasonForm oldSeasonId={item.id} />)}
        />
      );
    } else if (value === FORM_KIND.SEASON) {
      setForm(<SeasonForm />);
    }
  }, []);
  return (
    <div className={style.box}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WithSeasonForm>
          <WithPromotionRelegation
            seasonId={selectedSeasonId}
            leagueId={league.league?.id}
          >
            <WithPopup content={form}>
              <Heading translateKey="seasons" />
              <SeasonList changeForm={changeForm} />
              <AddSeason onAction={() => setForm(<SeasonForm />)} />
            </WithPopup>
          </WithPromotionRelegation>
        </WithSeasonForm>
      </LocalizationProvider>
    </div>
  );
});

export { Season };
