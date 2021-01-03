/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FunctionComponent, useState } from "react";
import Translated from "../../components/translated";
import { ChatServiceProvider, Message } from "../../context/chat-service";

interface Props {
  gameId: string;
  side: number;
  messages: Array<Message>;
}

const preapprovedMessages = [
  Translated.byKey("hello"),
  Translated.byKey("thankYouForGame"),
  Translated.byKey("wellPlayed"),
  Translated.byKey("goodGame"),
  Translated.byKey("iLikeYourOpening"),
  Translated.byKey("greatEndgame"),
  Translated.byKey("mouseSlip"),
  Translated.byKey("letsPlayAgain"),
  Translated.byKey("areYouAtSpillsjakkDiscord"),
  Translated.byKey("iDidntNeedThatPiece"),
  Translated.byKey("congrats"),
  Translated.byKey("iNeedtoRethink"),
  Translated.byKey("niceTactic"),
  Translated.byKey("flaggingTime"),
];

const WithChatService: FunctionComponent<Props> = ({
  side,
  gameId,
  messages,
  children,
}) => {
  const [message, setMessage] = useState("");
  function onMessageInputChange(message: string): void {
    setMessage(message);
  }
  function onSubmit(): void {
    const message_id = preapprovedMessages.indexOf(message);
    if (message_id >= 0) {
      fetch(`/socket/message/${gameId}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, message_id }),
      });
      setMessage("");
    }
  }
  return (
    <ChatServiceProvider
      value={{
        messages,
        onMessageInputChange,
        onSubmit,
        preapprovedMessages,
        message,
      }}
    >
      {children}
    </ChatServiceProvider>
  );
};

export { WithChatService };
