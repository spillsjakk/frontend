import React, { FormEvent, FunctionComponent, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import { useClub } from "../../../context/club";

const MessageSummary: FunctionComponent<{}> = () => {
  const [clubMessage, setClubMessage] = useState("");
  const club = useClub();
  function messageMembers(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/club/message-members/${club.id}`,
      "POST",
      { text: clubMessage },
      (_) => {
        setClubMessage("");
      }
    );
  }
  return (
    <div id="message">
      <div className={style.label}>{Translated.byKey("messageMembers")}</div>
      <form onSubmit={messageMembers}>
        <textarea />
        <button type="submit">{Translated.byKey("send")}</button>
      </form>
    </div>
  );
};

export { MessageSummary };
