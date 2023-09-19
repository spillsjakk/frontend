import React, { PureComponent } from "react";
import { Helmet } from "react-helmet";
import { Timestamp } from "../components/Timestamp";
import Translated from "../components/translated";
import UserLink from "../components/UserLink";
import { fetchJson, title } from "../functions";

type InboxState = {
  messages: Message[];
};

type Message = {
  sender: string;
  sender_name: string;
  moment: string;
  read: boolean;
  message: string;
};

class Inbox extends PureComponent<{}, InboxState> {
  constructor(props: {}) {
    super(props);

    this.state = { messages: [] };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Inbox";

    fetchJson(
      "/s/messages/get-and-mark-read",
      "POST",
      undefined,
      (messages) => {
        this.setState({ messages });
      }
    );
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("inbox")}</title>
        </Helmet>
        <h1 className="mt-5 p-3">
          <Translated str="inbox" />
        </h1>

        {this.state.messages.map((msg) => (
          <>
            <p style={msg.read ? {} : { fontWeight: "bold" }}>
              <Timestamp time={msg.moment} /> -&nbsp;
              <UserLink ghost={false} id={msg.sender} name={msg.sender_name} />
              :&nbsp;
              {msg.message}
            </p>
          </>
        ))}
      </>
    );
  }
}

export default Inbox;
