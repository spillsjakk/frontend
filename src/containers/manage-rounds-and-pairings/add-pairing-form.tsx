import React, { FunctionComponent, useState } from "react";
import { Round } from "../../context/tournament-round";
import { useTournamentPairing } from "../../context/tournament-pairing";
import Translated from "../../components/Translated";
import { Button } from "react-bootstrap";
import style from "./style.module.css";
import {
  Participant,
  useTournamentParticipants,
} from "../../context/tournament-participants";

interface Props {
  round: Round;
}

function getParticipantInfo(participant: Participant): string {
  return participant.fide_number
    ? `${participant.fide_number} ${participant.first_name} ${participant.last_name}`
    : `${participant.first_name} ${participant.last_name}`;
}

const AddPairingForm: FunctionComponent<Props> = ({ round }) => {
  const [whiteAccountName, setWhiteAccountName] = useState("");
  const [blackAccountName, setBlackAccountName] = useState("");

  const pairingContext = useTournamentPairing();
  const { participants } = useTournamentParticipants();

  function onPairingCreate(round: number) {
    return (e: any) => {
      e.preventDefault();
      const whiteAccount = participants.find(
        (participant) => getParticipantInfo(participant) === whiteAccountName
      );
      const blackAccount = participants.find(
        (participant) => getParticipantInfo(participant) === blackAccountName
      );
      if (!whiteAccount || !blackAccount) {
        return false;
      }
      pairingContext.add(whiteAccount!.account!, blackAccount!.account!, round);
      setWhiteAccountName("");
      setBlackAccountName("");
    };
  }

  return (
    <form
      className={style["pairing-form"]}
      onSubmit={onPairingCreate(round.number)}
    >
      <input
        placeholder={`${Translated.byKey(
          "nameOfThePlayer"
        )} (${Translated.byKey("white")})`}
        onChange={(e) => setWhiteAccountName(e.target.value)}
        value={whiteAccountName}
        list="participants"
      />
      <input
        placeholder={`${Translated.byKey(
          "nameOfThePlayer"
        )} (${Translated.byKey("black")})`}
        onChange={(e) => setBlackAccountName(e.target.value)}
        value={blackAccountName}
        list="participants"
      />
      <Button variant="primary" type="submit">
        <Translated str="addPairing" />
      </Button>
      {Array.isArray(participants) && (
        <datalist id="participants">
          {participants.map((participant, i) => (
            <option key={i} value={getParticipantInfo(participant)} />
          ))}
        </datalist>
      )}
    </form>
  );
};
export { AddPairingForm };
