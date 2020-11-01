import React, { FunctionComponent, useState } from "react";
import { Round } from "../../context/tournament-round";
import { useTournamentPairing } from "../../context/tournament-pairing";
import Translated from "../../components/Translated";
import { Button } from "react-bootstrap";
import style from "./style.module.css";

interface Props {
  round: Round;
}

const AddPairingForm: FunctionComponent<Props> = ({ round }) => {
  const [whiteAccountId, setWhiteAccountId] = useState("");
  const [blackAccountId, setBlackAccountId] = useState("");

  const pairingContext = useTournamentPairing();

  function onPairingCreate(round: number) {
    return (e: any) => {
      e.preventDefault();
      pairingContext.add(whiteAccountId, blackAccountId, round);
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
        onChange={(e) => setWhiteAccountId(e.target.value)}
      />
      <input
        placeholder={`${Translated.byKey(
          "nameOfThePlayer"
        )} (${Translated.byKey("black")})`}
        onChange={(e) => setBlackAccountId(e.target.value)}
      />
      <Button variant="primary" type="submit">
        <Translated str="addPairing" />
      </Button>
    </form>
  );
};
export { AddPairingForm };
