import React, { FunctionComponent, useEffect } from "react";
import { OnboardInvitation as Container } from "../../../containers/registration/onboard-invitation";
import { WithUserRegistration } from "../../../hocs/registration/user";
import "./style.scss";

const OnboardInvitation: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "registration-onboarding-invitation";
  }, []);
  return (
    <WithUserRegistration>
      <Container />
    </WithUserRegistration>
  );
};

export { OnboardInvitation };
