import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  TextField,
} from "@material-ui/core";
import React, { FunctionComponent, memo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import { usePopup } from "../../../hocs/popup/index";
import style from "./style.module.scss";
import { useCategoryForm } from "./with-category-form";

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

const GenderRestricted: FunctionComponent<{
  change: (value: boolean) => void;
  value: boolean;
}> = memo(({ change, value }) => (
  <>
    <FormControlLabel
      value="end"
      control={
        <Checkbox
          color="secondary"
          checked={value}
          onChange={(e) => change(e.target.checked)}
        />
      }
      label={<Translated str="genderRestricted" />}
      labelPlacement="end"
    />
  </>
));

const Gender: FunctionComponent<{
  change: (value: boolean) => void;
  value: boolean;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <FormControlLabel
      value="M"
      control={
        <Radio checked={value} onChange={() => change(true)} value="M" />
      }
      label={Translated.byKey("M Plays")}
      labelPlacement="top"
    />
    <FormControlLabel
      value="F"
      control={
        <Radio checked={!value} onChange={() => change(false)} value="F" />
      }
      label={Translated.byKey("F Plays")}
      labelPlacement="top"
    />
  </Grid>
));

const AgeRestricted: FunctionComponent<{
  change: (value: boolean) => void;
  value: boolean;
}> = memo(({ change, value }) => (
  <Grid item xs={4}>
    <FormControlLabel
      value="end"
      control={
        <Checkbox
          color="secondary"
          checked={value}
          onChange={(e) => change(e.target.checked)}
        />
      }
      label={<Translated str="ageRestricted" />}
      labelPlacement="end"
    />
  </Grid>
));

const MinimumAge: FunctionComponent<{
  change: (value: number) => void;
  value: number;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <TextField
      label={Translated.byKey("minimumAge")}
      fullWidth
      type="number"
      variant="outlined"
      multiline
      value={value}
      onChange={(e) => change(Number(e.target.value))}
    />
  </Grid>
));

const MaximumAge: FunctionComponent<{
  change: (value: number) => void;
  value: number;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <TextField
      label={Translated.byKey("maximumAge")}
      fullWidth
      type="number"
      variant="outlined"
      multiline
      value={value}
      onChange={(e) => change(Number(e.target.value))}
    />
  </Grid>
));

const MinimumRating: FunctionComponent<{
  change: (value: number) => void;
  value: number;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <TextField
      label={Translated.byKey("minimumRating")}
      fullWidth
      type="number"
      variant="outlined"
      multiline
      value={value}
      onChange={(e) => change(Number(e.target.value))}
    />
  </Grid>
));

const MaximumRating: FunctionComponent<{
  change: (value: number) => void;
  value: number;
}> = memo(({ change, value }) => (
  <Grid item xs={12}>
    <TextField
      label={Translated.byKey("maximumRating")}
      fullWidth
      type="number"
      variant="outlined"
      multiline
      value={value}
      onChange={(e) => change(Number(e.target.value))}
    />
  </Grid>
));

const RatingRestricted: FunctionComponent<{
  change: (value: boolean) => void;
  value: boolean;
}> = memo(({ change, value }) => (
  <Grid item xs={4}>
    <FormControlLabel
      value="end"
      control={
        <Checkbox
          color="secondary"
          checked={value}
          onChange={(e) => change(e.target.checked)}
        />
      }
      label={<Translated str="ratingRestricted" />}
      labelPlacement="end"
    />
  </Grid>
));

const CategoryForm: FunctionComponent<unknown> = () => {
  const form = useCategoryForm();
  const popup = usePopup();
  const { leagueId } = useParams<{ leagueId: string }>();

  useEffect(() => {
    if (form && !form.id) {
      form.changeId(generateId(8));
    }
  }, []);

  function create() {
    fetchJson(
      `/s/leagues/${leagueId}/categories`,
      "POST",
      {
        id: form.id,
        visible: form.visible,
        name: form.name,
        description: form.description,
        gender_restricted: form.gender_restricted,
        f_restricted: form.f_restricted,
        age_restricted: form.age_restricted,
        minimum_age: form.minimum_age,
        maximum_age: form.maximum_age,
        rating_restricted: form.rating_restricted,
        minimum_rating: form.minimum_rating,
        maximum_rating: form.maximum_rating,
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
        {Translated.byKey("createCategory").toUpperCase()}
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
            <Grid item container xs={4}>
              <GenderRestricted
                change={useCallback(
                  (value) => form.changeGenderRestricted(value),
                  []
                )}
                value={form.gender_restricted}
              />
              {form.gender_restricted && (
                <Gender
                  change={(value) => form.changeFRestricted(value)}
                  value={form.f_restricted}
                />
              )}
            </Grid>
            <Grid item container xs={4} spacing={3}>
              <AgeRestricted
                change={useCallback(
                  (value) => form.changeAgeRestricted(value),
                  []
                )}
                value={form.age_restricted}
              />
              {form.age_restricted && (
                <>
                  <MinimumAge
                    change={(value) => form.changeMinimumAge(value)}
                    value={form.minimum_age}
                  />
                  <MaximumAge
                    change={(value) => form.changeMaximumAge(value)}
                    value={form.maximum_age}
                  />
                </>
              )}
            </Grid>
            <Grid item container xs={4} spacing={3}>
              <RatingRestricted
                change={useCallback(
                  (value) => form.changeRatingRestricted(value),
                  []
                )}
                value={form.rating_restricted}
              />
              {form.rating_restricted && (
                <>
                  <MinimumRating
                    change={(value) => form.changeMinimumRating(value)}
                    value={form.minimum_rating}
                  />
                  <MaximumRating
                    change={(value) => form.changeMaximumRating(value)}
                    value={form.maximum_rating}
                  />
                </>
              )}
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

const Category: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();
  return (
    <>
      <Button onClick={() => popup.changeOpen(true)}>Add Category</Button>
    </>
  );
});

export { Category, CategoryForm };
