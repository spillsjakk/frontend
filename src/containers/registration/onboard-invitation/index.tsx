import React, { FunctionComponent, useState } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";
import { WithInvitation } from "../../../hocs/invitation";
import { FirstInfo } from "./first-info";
import { FideInfo } from "./fide-info";
import { Form } from "./form";

const OnboardInvitation: FunctionComponent<{}> = () => {
  const [step, setStep] = useState(0);

  const { id } = useParams<{ id: string }>();

  return (
    <WithInvitation id={id}>
      <main>
        <div className="header">
          {Translated.byKey("createYourAccount").toUpperCase()}
        </div>
        <div className="box">
          {step === 0 && <FirstInfo onNext={() => setStep(1)} />}
          {step === 1 && <FideInfo onNext={() => setStep(2)} />}
          {step === 2 && <Form />}
        </div>
      </main>
    </WithInvitation>
  );
};

export { OnboardInvitation };
