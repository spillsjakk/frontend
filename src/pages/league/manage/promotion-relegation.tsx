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

const CategoryStep: FunctionComponent<{
  category: Category;
  categories: Array<Category>;
  leagueId: string;
  seasonId: string;
  promotionRelegationList: Array<PromotionRelegation>;
  refreshPromotionRelegation: () => void;
}> = memo((props) => {
  const [participants, setParticipants] = useState<Array<Participant>>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const notification = useNotification();

  useEffect(() => {
    fetchCall(
      `/s/leagues/${props.category.league}/categories/${props.category.id}/participants`,
      "GET",
      undefined,
      (response) => {
        if (Array.isArray(response)) {
          setParticipants(response);
        }
      }
    );
  }, []);

  function getPlayerInputValue() {
    const participant = participants.find((p) => p.account === selectedUserId);
    if (participant) {
      return `${participant.first_name} ${participant.last_name}`;
    } else {
      return "";
    }
  }

  function getCategoryInputValue() {
    const category = props.categories.find((p) => p.id === selectedCategoryId);
    if (category) {
      return category.name;
    } else {
      return "";
    }
  }

  return (
    <form
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
            setSelectedCategoryId(null);
            setSelectedUserId(null);
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
        }}
        value={selectedUserId}
        inputValue={getPlayerInputValue()}
      />
      <Autocomplete
        data={props.categories
          .filter((category) => category.id !== props.category.id)
          .map((category) => ({
            name: category.name,
            value: category.id,
          }))}
        label={Translated.byKey("pleaseSelectCategoryToPromote")}
        onSelect={(value: Option) => {
          setSelectedCategoryId(value.value);
        }}
        value={selectedCategoryId}
        inputValue={getCategoryInputValue()}
      />
      <Button variant="contained" color="secondary" type="submit">
        {Translated.byKey("promote")}
      </Button>
      <List>
        {Array.isArray(props.promotionRelegationList) &&
          props.promotionRelegationList.map((p, i) => (
            <ListItem key={i}>
              <ListItemText>
                {p.firstName} {p.lastName} <ChevronRight /> {p.newCategoryName}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </form>
  );
});

const PromotionRelegationForm: FunctionComponent<{ season: Season }> = ({
  season,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const league = useLeague();
  const promotionRelegation = usePromotionRelegation();

  function next() {
    setActiveStep(activeStep + 1);
  }

  function previous() {
    setActiveStep(activeStep - 1);
  }

  return (
    <div>
      <Typography variant="h5">{Translated.byKey("promotion")}</Typography>
      <Stepper
        activeStep={activeStep}
        id={style.stepper}
        orientation="vertical"
      >
        {league &&
          Array.isArray(league.categories) &&
          league.categories.map((category) => (
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
                />
              </StepContent>
            </Step>
          ))}
      </Stepper>
      <Typography variant="h5">{Translated.byKey("relegation")}</Typography>
      <Stepper
        activeStep={activeStep}
        id={style.stepper}
        orientation="vertical"
      >
        {league &&
          Array.isArray(league.categories) &&
          league.categories.map((category) => (
            <Step key={category.id}>
              <StepLabel>
                <Label text={category.name} />
              </StepLabel>
              <StepContent></StepContent>
            </Step>
          ))}
      </Stepper>
    </div>
  );
};

export { PromotionRelegationForm };
