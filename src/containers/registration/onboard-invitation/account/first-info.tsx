import { Button } from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import Translated from "../../../../components/translated";
import { InviterType, useInvitation } from "../../../../context/invitation";
import { ErrorComponent, fetchCall } from "../../../../functions";
import style from "./style.module.scss";
import { useUser } from "../../../../components/UserContext";

function getLink(type: InviterType, id: string) {
  if (type === 0) {
    return `/organization/view/${id}`;
  } else if (type === 1) {
    return `/club/view/${id}`;
  }
}

function getInvitationText(type: InviterType, id: string, name: string) {
  const parts = Translated.byKey("youHaveBeenInvited").split("$name");
  return `${parts[0]}<Link to="${getLink(type, id)}">${name}</a>${parts[1]}`;
}

interface Props {
  onNext: () => void;
}

const FirstInfo: FunctionComponent<Props> = ({ onNext }) => {
  const [joining, setJoining] = useState(false);

  const { invitation } = useInvitation();

  const history = useHistory();
  const {
    user: { authenticated },
  } = useUser();

  function joinToClub() {
    if (joining) return;
    setJoining(true);
    fetchCall(
      "/s/registrations/accounts",
      "PATCH",
      {
        invitation_id: invitation.id,
      },
      (response) => {
        setJoining(false);
        history.push(`/club/view/${response.club_id}`);
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
        } else if (error === "400") {
          ReactDOM.render(
            <>
              <ErrorComponent err={Translated.byKey("alreadyAMember")} />
            </>,
            document.getElementById("error")
          );
        }
      }
    );
  }

  return (
    <div
      className={`${style["first-info"]} ${authenticated ? style.center : ""}`}
    >
      {invitation && (
        <div
          className={style.text}
          dangerouslySetInnerHTML={{
            __html: getInvitationText(
              invitation.invitertype,
              invitation.inviterid,
              invitation.invitername
            ),
          }}
        ></div>
      )}
      {!authenticated ? (
        <div className={style.actions}>
          <div>
            <Button color="primary" variant="contained" onClick={onNext}>
              {Translated.byKey("createAccount").toUpperCase()}
            </Button>
          </div>
          <div>
            <Button color="primary" variant="outlined" onClick={joinToClub}>
              {Translated.byKey("alreadyHaveAccount")}{" "}
              {Translated.byKey("oneClickJoin")}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button color="primary" variant="contained" onClick={joinToClub}>
            {Translated.byKey("join")}
          </Button>
        </div>
      )}
    </div>
  );
};

export { FirstInfo };
