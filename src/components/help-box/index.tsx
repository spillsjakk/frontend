import React, { FunctionComponent, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../translated";
import "./style.scss";

interface Props {
  placement: "right" | "left" | "top" | "bottom";
  text: string;
  name: string;
  show: boolean;
}

function getKey(name: string) {
  return `show-helpbox-${name}`;
}

const HelpBox: FunctionComponent<Props> = (props) => {
  const { children, placement, text, name } = props;
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.show && !localStorage.getItem(getKey(name))) {
      setShow(true);
    }
  }, [props.show]);
  return (
    <OverlayTrigger
      show={show}
      placement={placement}
      overlay={
        <Tooltip id="help-box">
          <div>{text}</div>
          <button
            onClick={() => {
              setShow(false);
              localStorage.setItem(getKey(name), "true");
            }}
          >
            {Translated.byKey("ok")}
          </button>
        </Tooltip>
      }
    >
      {children as any}
    </OverlayTrigger>
  );
};

export { HelpBox };

export const helpboxNames = {
  logo: "logo",
  userIcon: "userIcon",
  homeTournaments: "homeTournaments",
  userProfileTournament: "user-profile-tournament",
  userProfileAccountSettings: "user-profile-account-settings",
  createAccountsAction: "create-accounts-action",
  createAccountsInputs: "create-accounts-inputs",
  generateInvitationLink: "generate-invitation-link",
  invitationLinkDescription: "invitation-link-description",
  clubManageDetail: "club-manage-detail",
  clubManageAccounts: "club-manage-accounts",
  clubManageMessage: "club-manage-message",
  clubManageSharePower: "club-manage-share-power",
  clubManageStats: "club-manage-stats",
  clubManageTeams: "club-manage-teams",
  tournamentDetailManageTournament: "tournament-detail-manage-tournament",
  manageTournamentManageParticipants: "manage-tournament-manage-participants",
  manageTournamentChangeTime: "manage-tournament-change-time",
  manageTournamentStandings: "manage-tournaments-standings",
};
