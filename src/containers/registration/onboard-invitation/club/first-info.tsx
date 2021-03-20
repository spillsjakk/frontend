import React, { FunctionComponent, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import Translated from "../../../../components/translated";
import { InviterType, useInvitation } from "../../../../context/invitation";
import { ErrorComponent, fetchCall } from "../../../../functions";

function getLink(type: InviterType, id: string) {
  if (type === 0) {
    return `/organization/view/${id}`;
  } else if (type === 1) {
    return `/club/view/${id}`;
  }
}

function getInvitationText(type: InviterType, id: string, name: string) {
  const parts = Translated.byKey("clubYouHaveBeenInvited").split("$name");
  return `${parts[0]}<a href="${getLink(type, id)}">${name}</a>${parts[1]}`;
}

interface Props {
  onNext: () => void;
}

const FirstInfo: FunctionComponent<Props> = ({ onNext }) => {
  const [joining, setJoining] = useState(false);

  const { invitation } = useInvitation();

  const history = useHistory();

  function joinToClub() {
    if (joining) return;
    setJoining(true);
    fetchCall(
      "/s/registrations/clubs",
      "PATCH",
      {
        invitation_id: invitation.id,
      },
      () => {
        setJoining(false);
        history.push(`/club/manage`);
      },
      (error) => {
        setJoining(false);
        if (error === "404") {
          ReactDOM.render(
            <>
              <ErrorComponent err={Translated.byKey("loginAndTryAgain")} />
            </>,
            document.getElementById("error")
          );
          history.push(`/login?path=/invitation/${invitation.id}`);
        }
      }
    );
  }

  return (
    <>
      {invitation && (
        <div
          className="bold"
          dangerouslySetInnerHTML={{
            __html: getInvitationText(
              invitation.invitertype,
              invitation.inviterid,
              invitation.invitername
            ),
          }}
        ></div>
      )}
      <button className="action-button" onClick={onNext}>
        {Translated.byKey("next").toUpperCase()}
      </button>
      <div className="text-align-end italic">
        {Translated.byKey("alreadyHaveAccount")}
        <span
          className={`green pointer ${joining ? "disabled" : ""}`}
          onClick={joinToClub}
        >
          {" "}
          {Translated.byKey("oneClickJoin")}
        </span>
      </div>
    </>
  );
};

export { FirstInfo };
