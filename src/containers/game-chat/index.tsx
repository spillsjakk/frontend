import React, { FunctionComponent } from "react";
import Translated from "../../components/translated";
import { useChatService } from "../../context/chat-service";
import "./style.scss";

interface Props {
  color?: "black" | "white";
}

const GameChat: FunctionComponent<Props> = ({ color }) => {
  const {
    preapprovedMessages,
    messages,
    onSubmit,
    onMessageInputChange,
    message,
  } = useChatService();
  function getName(side: number) {
    if (!color && side === 0) {
      return Translated.byKey("white");
    }
    if (!color && side === 1) {
      return Translated.byKey("black");
    }
    if (
      (side === 0 && color === "white") ||
      (side === 1 && color === "black")
    ) {
      return Translated.byKey("you");
    } else {
      return Translated.byKey("opponent");
    }
  }
  return (
    <div className="game-chat">
      <div className="text-area">
        {Array.isArray(messages) &&
          preapprovedMessages &&
          messages.map((message, i) => {
            return (
              <div className="item" key={i}>
                {getName(message.side)}:{" "}
                {preapprovedMessages[message.message_id]}
              </div>
            );
          })}
      </div>
      <div className="message-area">
        <form
          onSubmit={(e) => {
            onSubmit && onSubmit();
            e.preventDefault();
          }}
        >
          <input
            placeholder={Translated.byKey("startTyping")}
            onChange={(e) => {
              onMessageInputChange && onMessageInputChange(e.target.value);
            }}
            list="preapproved-messages"
            value={message}
          />
        </form>
        <datalist id="preapproved-messages">
          {Array.isArray(preapprovedMessages) &&
            preapprovedMessages.map((message, i) => {
              return <option key={i} value={message} />;
            })}
        </datalist>
      </div>
    </div>
  );
};

export { GameChat };
