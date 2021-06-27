import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, memo, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import { Category, useLeague, Season } from "../../../hocs/with-league/index";
import style from "./style.module.scss";
import { fetchCall } from "../../../functions";
import { Participant } from "../../Tournament/Types";
import { Autocomplete, Option } from "../../../components/autocomplete";
import { useNotification } from "../../../hocs/with-notification";
import {
  PromotionRelegation,
  usePromotionRelegation,
} from "./with-promotion-relegation";
import { ChevronRight, Delete } from "@material-ui/icons";

function Label({ text }: { text: string }) {
  return <div className={style.heading}>{text}</div>;
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
        variant="outlined"
        color="primary"
        onClick={onRightClick}
        type="submit"
      >
        {rightText}
      </Button>
    </div>
  );
}

const CategoryStep: FunctionComponent<{
  category: Category;
  categories: Array<Category>;
  leagueId: string;
  seasonId: string;
  promotionRelegationList: Array<PromotionRelegation>;
  refreshPromotionRelegation: () => void;
  actionButtonText: string;
}> = memo((props) => {
  const [participants, setParticipants] = useState<Array<Participant>>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [userText, setUserText] = useState("");
  const [categoryText, setCategoryText] = useState("");

  const notification = useNotification();

  useEffect(() => {
    fetchCall(
      `/s/leagues/${props.leagueId}/categories/${props.category.id}/participants`,
      "GET",
      undefined,
      (response) => {
        if (Array.isArray(response)) {
          setParticipants(response);
        }
      }
    );
  }, []);

  function deletePromotionRelegation(userId) {
    fetchCall(
      `/s/leagues/${props.leagueId}/seasons/${props.seasonId}/promotion-relegation/${userId}`,
      "DELETE",
      undefined,
      () => {
        props.refreshPromotionRelegation();
      }
    );
  }
  return (
    <>
      <form
        className={style["promotion-relegation-form"]}
        onSubmit={(e) => {
          e.preventDefault();

          if (!selectedCategoryId || !selectedUserId) return;

          fetchCall(
            `/s/leagues/${props.leagueId}/seasons/${props.seasonId}/promotion-relegation`,
            "POST",
            {
              user_id: selectedUserId,
              old_category: props.category.id,
              new_category: selectedCategoryId,
            },
            () => {
              setSelectedCategoryId("");
              setSelectedUserId("");
              setUserText("");
              setCategoryText("");
              notification.notify("success", Translated.byKey("successfull"));
              props.refreshPromotionRelegation();
            },
            () => {
              notification.notify("error", Translated.byKey("error"));
            }
          );
        }}
      >
        <Autocomplete
          data={participants.map((participant) => ({
            name: `${participant.first_name} ${participant.last_name}`,
            value: participant.account,
          }))}
          label={Translated.byKey("pleaseSelectPlayer")}
          onSelect={(value: Option) => {
            setSelectedUserId(value.value);
            setUserText(value.name);
          }}
          onChange={(value: string) => {
            setUserText(value);
          }}
          value={selectedUserId}
          inputValue={userText}
        />
        <Autocomplete
          data={props.categories
            .filter((category) => category.id !== props.category.id)
            .map((category) => ({
              name: category.name,
              value: category.id,
            }))}
          label={Translated.byKey("pleaseSelectCategory")}
          onSelect={(value: Option) => {
            setSelectedCategoryId(value.value);
          }}
          onChange={(value: string) => {
            setCategoryText(value);
          }}
          value={selectedCategoryId}
          inputValue={categoryText}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={style["m-tb-1"]}
        >
          {Translated.byKey("promote")}/{Translated.byKey("relegate")}
        </Button>
      </form>
      <List>
        {Array.isArray(props.promotionRelegationList) &&
          props.promotionRelegationList
            .filter((p) => p.oldCategory === props.category.id)
            .map((p, i) => (
              <ListItem key={i}>
                <ListItemText>
                  {p.firstName} {p.lastName} <ChevronRight />{" "}
                  {p.newCategoryName}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => deletePromotionRelegation(p.userId)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
      </List>
    </>
  );
});

const PromotionRelegationForm: FunctionComponent<{
  season: Season;
}> = ({ season }) => {
  const [activeStep, setactiveStep] = useState(0);

  const league = useLeague();
  const promotionRelegation = usePromotionRelegation();

  function endSeason() {}

  function next() {
    setactiveStep(activeStep + 1);
  }

  function previous() {
    setactiveStep(activeStep - 1);
  }

  return (
    <>
      <Typography variant="h5">
        {Translated.byKey("promotion")}/{Translated.byKey("relegation")}
      </Typography>
      <Stepper
        activeStep={activeStep}
        id={style.stepper}
        orientation="vertical"
      >
        {league &&
          Array.isArray(league.categories) &&
          league.categories.map((category, i) => (
            <Step key={category.id}>
              <StepLabel>
                <Label text={category.name} />
              </StepLabel>
              <StepContent>
                <CategoryStep
                  category={category}
                  categories={league.categories}
                  leagueId={league.league.id}
                  seasonId={season.id}
                  promotionRelegationList={promotionRelegation.promotionRelegationList.filter(
                    (p) => p.season === season.id
                  )}
                  refreshPromotionRelegation={promotionRelegation.refresh}
                  actionButtonText={Translated.byKey("promote")}
                />
                <ActionButtons
                  onRightClick={
                    i === league.categories.length - 1 ? endSeason : next
                  }
                  rightText={
                    i === league.categories.length - 1
                      ? Translated.byKey("endSeasonAndStartNewOne")
                      : undefined
                  }
                  onLeftClick={previous}
                  leftDisabled={i === 0}
                />
              </StepContent>
            </Step>
          ))}
      </Stepper>
    </>
  );
};

export { PromotionRelegationForm };
