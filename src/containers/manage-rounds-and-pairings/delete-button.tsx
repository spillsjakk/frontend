import React, { FunctionComponent } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  onClick: () => void;
  tooltip: string;
}

const DeleteButton: FunctionComponent<Props> = ({ onClick, tooltip }) => {
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 1, hide: 400 }}
        overlay={(props) => (
          <Tooltip id="button-tooltip" {...props}>
            {tooltip}
          </Tooltip>
        )}
      >
        <button
          type="button"
          className="close"
          style={{ marginLeft: "10px", color: "black" }}
          onClick={onClick}
        >
          <span aria-hidden="true">×</span>
        </button>
      </OverlayTrigger>
    </>
  );
};
export { DeleteButton };
