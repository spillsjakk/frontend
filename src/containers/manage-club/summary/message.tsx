import React, { FormEvent, FunctionComponent, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import { useClub } from "../../../context/club";
import { Form } from "react-bootstrap";
import { HelpBox, helpboxNames } from "../../../components/help-box";

const MessageSummary: FunctionComponent<{}> = () => {
  const [clubMessage, setClubMessage] = useState("");
  const [teamMessage, setTeamMessage] = useState("");
  const [team, setTeam] = useState("");
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
  function messageTeamMembers(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/team/message-members/${team}`,
      "POST",
      { text: teamMessage },
      (_) => {
        setTeamMessage("");
      }
    );
  }
  return (
    <div id={style.message}>
      <HelpBox
        placement="bottom"
        name={helpboxNames.clubManageMessage}
        text={Translated.byKey("clubManageMessageHelpbox")}
        show={true}
      >
        <div className={style.label}>
          {Translated.byKey("messageAllClubMembers")}
        </div>
      </HelpBox>
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
      <Form onSubmit={messageTeamMembers}>
        <Form.Group>
          <textarea
            required
            onChange={(e) => {
              setTeamMessage(e.target.value);
            }}
            value={teamMessage}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="select"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option value="">{Translated.byKey("pleaseSelect")}</option>
            {club.teams &&
              club.teams.map((team, i) => (
                <option key={i.toString()} value={team.id}>
                  {team.name}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <button type="submit">{Translated.byKey("send")}</button>
      </Form>
    </div>
  );
};

export { MessageSummary };
