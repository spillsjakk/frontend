import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../../components/translated";
import { FirstInfo } from "./first-info";
import { Form } from "./form";
import { useUser } from "../../../../components/UserContext";
import { useHistory, useParams } from "react-router-dom";
import { ErrorComponent } from "../../../../functions";
import ReactDOM from "react-dom";
import { useInvitation } from "../../../../context/invitation";

const ClubOnboarding: FunctionComponent<{}> = () => {
  const [step, setStep] = useState(0);

  const history = useHistory();
  const userContext = useUser();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (
      userContext &&
      userContext.user &&
      userContext.user.authenticated === false
    ) {
      ReactDOM.render(
        <>
          <ErrorComponent err={Translated.byKey("loginFirst")} />
        </>,
        document.getElementById("error")
      );
      history.push(`/login?path=/invitation/${id}`);
    }
  }, [userContext]);

  return (
    <main>
      <div className="header">
        {Translated.byKey("createYourAccount").toUpperCase()}
      </div>
      <div className="box">
        {step === 0 && <FirstInfo onNext={() => setStep(1)} />}
        {step === 1 && <Form />}
      </div>
    </main>
  );
};

export { ClubOnboarding };
