import React, { FunctionComponent } from "react";
import { Timestamp } from "../../components/Timestamp";
import UserLink from "../../components/UserLink";
import { Message as IMessage } from "./";

interface Props {
  message: IMessage;
}

const Message: FunctionComponent<Props> = ({ message }) => {
  return (
    <article className="box">
      <div className="info">
        <div className="text">
          <div>
            <span className="bold">From: </span>
            <span className="italic">
              <UserLink
                ghost={false}
                id={message.sender}
                name={message.sender_name}
              />
            </span>
          </div>
          <div>
            <span className="bold">Date: </span>
            <Timestamp time={message.moment} />
          </div>
        </div>
        <div className={`icon ${message.read ? "green" : "red"}`}></div>
      </div>
      <div className="body">{message.message}</div>
    </article>
  );
};
export { Message };
