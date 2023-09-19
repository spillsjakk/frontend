import React, { FunctionComponent, useState } from "react";
import { HelpBox, helpboxNames } from "../../../components/help-box";
import Translated from "../../../components/translated";
import { fetchCall } from "../../../functions";
import { useNotification } from "../../../hocs/with-notification/index";

interface Props {
  tournamentId: string;
  onSuccess: any;
}

const ChangePairingTime: FunctionComponent<Props> = (props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const notification = useNotification();

  function onUpdatePairingTime(e: any) {
    e.preventDefault();

    const pairingDateTime = new Date(date + "T" + time);
    const pairingDateIsoParts = pairingDateTime.toISOString().split("T");
    const dateUtc = pairingDateIsoParts[0];
    const timeUtc = pairingDateIsoParts[1].substr(0, 5);

    fetchCall(
      `/s/tournament/change-online-pairing/${props.tournamentId}`,
      "POST",
      {
        next_pairing_date: dateUtc,
        next_pairing_time: timeUtc,
      },
      () => {
        props.onSuccess();
        notification.notify("success", Translated.byKey("successful"));
      },
      (result) => {
        notification.notify("error", result);
      }
    );
  }
  return (
    <form onSubmit={onUpdatePairingTime}>
      <HelpBox
        placement="bottom"
        name={helpboxNames.manageTournamentChangeTime}
        text={Translated.byKey("manageTournamentChangeTimeHelpbox")}
        show={true}
      >
        <label htmlFor="next_pairing_date">
          <Translated str="changeNextPairingDateTime" /> (hh:mm,{" "}
          <Translated str="localTime" />
          !):
        </label>
      </HelpBox>
      <input
        value={date}
        type="date"
        id="next_pairing_date"
        className="form-control"
        name="next_pairing_date"
        style={{ display: "inline", width: "13%" }}
        required
        min="2000-01-01"
        max="2099-12-31"
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        value={time}
        type="input"
        className="form-control"
        name="next_pairing_time"
        style={{ display: "inline", width: "13%" }}
        required
        pattern="\d\d?:\d\d"
        onChange={(e) => setTime(e.target.value)}
      />
      <button className="p-2 btn btn-primary mb-1" type="submit">
        <Translated str="update" />
      </button>
    </form>
  );
};

export { ChangePairingTime };
