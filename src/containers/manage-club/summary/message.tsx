import React, { FormEvent, FunctionComponent, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import { useClub } from "../../../context/club";
import { Form } from "react-bootstrap";

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
    <div id={style.message}>
      <div className={style.label}>{Translated.byKey("messageMembers")}</div>
      <Form onSubmit={messageMembers}>
        <Form.Group>
          <textarea
            required
            onChange={(e) => {
              setClubMessage(e.target.value);
            }}
            value={clubMessage}
          />
        </Form.Group>
        <button type="submit">{Translated.byKey("send")}</button>
      </Form>
      <div className={style.label}>
        {Translated.byKey("messageJustToTeamMembers")}
      </div>
      <Form onSubmit={messageMembers}>
        <Form.Group>
          <textarea required />
        </Form.Group>
        <button type="submit">{Translated.byKey("send")}</button>
      </Form>
    </div>
  );
};

export { MessageSummary };
