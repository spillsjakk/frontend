import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AccountOnboarding } from "../../../containers/registration/onboard-invitation/account";
import { ClubOnboarding } from "../../../containers/registration/onboard-invitation/club";
import { useInvitation } from "../../../context/invitation";
import { WithInvitation } from "../../../hocs/invitation";
import "./style.scss";

const DecideClubOrAccount: FunctionComponent<{}> = () => {
  const { invitation } = useInvitation();
  return (
    <>
      {invitation.invitertype === 0 && <ClubOnboarding />}
      {invitation.invitertype === 1 && <AccountOnboarding />}
    </>
  );
};

const OnboardInvitation: FunctionComponent<{}> = () => {
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "registration-onboarding-invitation";
  }, []);
  return (
    <WithInvitation id={id}>
      <DecideClubOrAccount />
    </WithInvitation>
  );
};

export { OnboardInvitation };
