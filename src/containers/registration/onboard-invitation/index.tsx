import React, { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import Translated from "../../../components/translated";

function getInvitationText(id: string) {
  const parts = Translated.byKey("youHaveBeenInvited").split("$name");
  return `${parts[0]}<span class="green pointer">${id}</span>${parts[1]}`;
}

const OnboardInvitation: FunctionComponent<{}> = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <main>
      <div className="header">
        {Translated.byKey("createYourAccount").toUpperCase()}
      </div>
      <div className="box">
        <div
          className="bold"
          dangerouslySetInnerHTML={{ __html: getInvitationText(id) }}
        ></div>
        <button className="action-button">
          {Translated.byKey("next").toUpperCase()}
        </button>
        <div className="text-align-end italic">
          {Translated.byKey("alreadyHaveAccount")}
          <span className="green pointer">
            {" "}
            {Translated.byKey("oneClickJoin")}
          </span>
        </div>
      </div>
    </main>
  );
};

export { OnboardInvitation };
