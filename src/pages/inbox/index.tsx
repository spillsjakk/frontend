import React, { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { fetchJson, title } from "../../functions";
import { Message } from "./message";
import "./style.scss";

export type Message = {
  sender: string;
  sender_name: string;
  moment: string;
  read: boolean;
  message: string;
};

const Inbox: FunctionComponent<{}> = () => {
  const [messages, setMessages] = useState<Message>();

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "inbox-page";
    fetchJson(
      "/s/messages/get-and-mark-read",
      "POST",
      undefined,
      (messages) => {
        setMessages(messages);
      }
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>{title("inbox")}</title>
      </Helmet>
      <div className="wrapper">
        <div className="header">{Translated.byKey("inbox")}</div>
        {Array.isArray(messages) &&
          messages.map((message, i) => <Message key={i} message={message} />)}
      </div>
    </>
  );
};
export { Inbox };
