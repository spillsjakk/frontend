import React, { FormEvent, FunctionComponent, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../../components/translated";
import { fetchJson } from "../../../../functions";
import { useOrganization } from "../../../../context/organization";
import { Form } from "react-bootstrap";

const MessageSummary: FunctionComponent<{}> = () => {
  const [organizationMessage, setOrganizationMessage] = useState("");
  const organization = useOrganization();
  function messageMembers(e: FormEvent) {
    e.preventDefault();

    fetchJson(
      `/s/organization/message-members/${organization.id}`,
      "POST",
      { text: organizationMessage },
      (_) => {
        setOrganizationMessage("");
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
              setOrganizationMessage(e.target.value);
            }}
            value={organizationMessage}
          />
        </Form.Group>
        <button type="submit">{Translated.byKey("send")}</button>
      </Form>
    </div>
  );
};

export { MessageSummary };
