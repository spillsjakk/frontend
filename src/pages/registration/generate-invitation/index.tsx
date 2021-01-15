import React, { FunctionComponent, useEffect } from "react";
import { GenerateInvitation as Container } from "../../../containers/registration/generate-invitation";
import "./style.scss";

const GenerateInvitation: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id =
      "registration-invitation-generation";
  }, []);

  return <Container />;
};

export { GenerateInvitation };
