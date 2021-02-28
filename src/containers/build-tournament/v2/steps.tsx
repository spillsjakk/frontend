import React, { FunctionComponent, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  StepContent,
  Select,
} from "@material-ui/core";
import { useTemplate } from "../../../context/build-tournament-template";
import style from "./style.module.scss";

const Steps: FunctionComponent<{}> = () => {
  const { templates, onSelect, placeholder, selectedTemplate } = useTemplate();
  const [activeStep, setActiveStep] = useState(0);
  return (
    <>
      <Stepper
        activeStep={activeStep}
        id={style.stepper}
        orientation="vertical"
      >
        <Step>
          <StepLabel>
            <div className={style.heading}>Template Selection</div>
          </StepLabel>
          <StepContent>
            <div className={style.content}>
              <div className={style.description}>
                Choose from saved templates or tweak every setting related to
                the tournament
              </div>
              <div className={style.inputs}>
                <Select
                  onChange={(e) => onSelect(Number(e.target.value))}
                  variant="outlined"
                  native
                >
                  <option value={placeholder.value}>{placeholder.name}</option>
                  {Array.isArray(templates) &&
                    templates.map((template) => (
                      <option value={template.value} key={template.value}>
                        {template.name}
                      </option>
                    ))}
                </Select>
              </div>
              <div className={style.actions}>
                <Button>Custom Settings</Button>
                <Button
                  disabled={!selectedTemplate}
                  variant="contained"
                  color="secondary"
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
};

export { Steps };
