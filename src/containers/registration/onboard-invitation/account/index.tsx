import React, { FunctionComponent, useState } from "react";
import Translated from "../../../../components/translated";
import { FirstInfo } from "./first-info";
import { FideInfo } from "./fide-info";
import { Form } from "./form";
import { WithUserRegistration } from "../../../../hocs/registration/user";
import { useUser } from "../../../../components/UserContext";

const AccountOnboarding: FunctionComponent<{}> = () => {
  const [step, setStep] = useState(0);

  const {
    user: { authenticated },
  } = useUser();

  return (
    <WithUserRegistration>
      <main>
        {!authenticated && (
          <div className="header">
            {Translated.byKey("createYourAccount").toUpperCase()}
          </div>
        )}
        <div className="box">
          {step === 0 && <FirstInfo onNext={() => setStep(1)} />}
          {step === 1 && <FideInfo onNext={() => setStep(2)} />}
          {step === 2 && <Form />}
        </div>
      </main>
    </WithUserRegistration>
  );
};

export { AccountOnboarding };
