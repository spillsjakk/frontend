import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  TextField,
} from "@material-ui/core";
import React, { FunctionComponent, memo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { fetchJson, generateId } from "../../../functions";
import { usePopup, WithPopup } from "../../../hocs/popup/index";
import { useLeague } from "../../../hocs/with-league";
import style from "./style.module.scss";
import { useCategoryForm, WithCategoryForm } from "./with-category-form";
import { Category as ICategory } from "../../../hocs/with-league/index";
import EditIcon from "@material-ui/icons/Edit";
import { FORM_TYPE } from "./with-season-form";

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
  const league = useLeague();
  const form = useCategoryForm();
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
        league.fetchCategories();
        popup.changeOpen(false);
        form.resetValues();
      }
    );
  }

  function edit() {
    fetchJson(
      `/s/leagues/${leagueId}/categories/${form.id}`,
      "PUT",
      {
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
        league.fetchCategories();
        popup.changeOpen(false);
        form.resetValues();
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
          form.type === FORM_TYPE.CREATE ? "createCategory" : "editCategory"
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
        {Translated.byKey(form.type === FORM_TYPE.CREATE ? "create" : "edit")}
      </Button>
    </form>
  );
};

const AddCategory: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();
  const form = useCategoryForm();

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => {
        form.changeType(FORM_TYPE.CREATE);
        popup.changeOpen(true);
      }}
    >
      {Translated.byKey("addCategory")}
    </Button>
  );
});

const CategoryItem: FunctionComponent<{
  item: ICategory;
  edit: (item: ICategory) => void;
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

const CategoryList: FunctionComponent<unknown> = memo(() => {
  const league = useLeague();
  const { changeOpen } = usePopup();
  const { changeType, fillValues } = useCategoryForm();

  const edit = useCallback(
    (item: ICategory) => {
      changeType(FORM_TYPE.EDIT);
      fillValues(item);
      changeOpen(true);
    },
    [changeOpen, changeType, fillValues]
  );

  return (
    <List>
      {league &&
        Array.isArray(league.categories) &&
        league.categories.map((item, i) => (
          <CategoryItem item={item} key={i} edit={edit} />
        ))}
    </List>
  );
});

const Category: FunctionComponent<unknown> = memo(() => {
  return (
    <div className={style.category}>
      <WithCategoryForm>
        <WithPopup content={<CategoryForm />}>
          <Heading translateKey="categories" />
          <CategoryList />
          <AddCategory />
        </WithPopup>
      </WithCategoryForm>
    </div>
  );
});

export { Category, CategoryForm };
