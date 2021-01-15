import React, { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";

const OnboardInvitation: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "registration-onboarding-invitation";
  }, []);
  const params = useParams<{ id: string }>();
  return <>{params.id}</>;
};

export { OnboardInvitation };
