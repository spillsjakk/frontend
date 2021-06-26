import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import Translated from "../../../components/translated";
import { useLeague } from "../../../hocs/with-league/index";
import style from "./style.module.scss";

function Label({ text }: { text: string }) {
  return <div className={style.heading}>{text}</div>;
}

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
            <Step key={category.id}>
              <StepLabel>
                <Label text={category.name} />
              </StepLabel>
              <StepContent></StepContent>
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
