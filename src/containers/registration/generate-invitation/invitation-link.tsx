import React, { FunctionComponent, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Translated from "../../../components/translated";

interface Props {
  invitationId: string;
}

const InvitationLink: FunctionComponent<Props> = ({ invitationId }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="invitation  mr-1"
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/invitation/${invitationId}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }}
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-top-copy`}>
            {!copied && <strong>{Translated.byKey("clickToCopy")}</strong>}
            {copied && <strong>{Translated.byKey("copied")}</strong>}
          </Tooltip>
        }
      >
        <div>
          {window.location.origin}/invitation/{invitationId}
        </div>
      </OverlayTrigger>
    </div>
  );
};

export { InvitationLink };
