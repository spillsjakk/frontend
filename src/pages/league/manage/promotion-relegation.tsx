import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import { Category, useLeague } from "../../../hocs/with-league/index";
import style from "./style.module.scss";
import { fetchJson } from "../../../functions";
import { Participant } from "../../Tournament/Types";

function Label({ text }: { text: string }) {
  return <div className={style.heading}>{text}</div>;
}

const CategoryStep: FunctionComponent<{ category: Category }> = (props) => {
  const [participants, setParticipants] = useState<Array<Participant>>([]);

  useEffect(() => {
    fetchJson(
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
  return (
    <Step>
      <StepLabel>
        <Label text={props.category.name} />
      </StepLabel>
      <StepContent {...props}>
        <div>
          {Array.isArray(participants) &&
            participants.map((participant) => (
              <div key={participant.account}>{participant.account}</div>
            ))}
        </div>
      </StepContent>
    </Step>
  );
};

const PromotionRelegationForm: FunctionComponent<unknown> = () => {
  const [activeStep, setActiveStep] = useState(0);

  const league = useLeague();

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
            <CategoryStep key={category.id} category={category} />
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
