import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { HelpBox, helpboxNames } from "../../components/help-box";
import { ListItem, ListItemText, Menu } from "@material-ui/core";
import { MessageNotification } from "./message-notification";

function useMessages() {
  const [messages, setMessages] = useState([]);
  const [messageNotificationOpen, setMessageNotificationOpen] = useState(false);

  const { user, setUser } = useUser();
  const location = useLocation();

  function authenticated() {
    return user && user.authenticated === true;
  }

  function checkMessages() {
    if (authenticated()) {
      fetch("/s/messages/has-unread", {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status < 400) {
            return response.json();
          } else {
            return Promise.resolve({ error: response.status.toString() });
          }
        })
        .then((json) => {
          if (json.error === "404") {
            setUser({ authenticated: false });
          }
          if (!json.error && Array.isArray(json) && json.length > 0) {
            setMessages(json);
            setMessageNotificationOpen(true);
          } else {
            setMessages([]);
            setMessageNotificationOpen(false);
          }
        });
    }
  }

  useEffect(() => {
    if (location.pathname !== "/inbox") {
      checkMessages();
      const interval = setInterval(checkMessages, 30000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
      setMessageNotificationOpen(false);
    }
  }, [user, location.pathname]);

  return { messages, messageNotificationOpen, setMessageNotificationOpen };
}

const Actions: FunctionComponent<unknown> = () => {
  const { user, setUser } = useUser();

  const { messages, messageNotificationOpen, setMessageNotificationOpen } =
    useMessages();

  function authenticated() {
    return user && user.authenticated === true;
  }

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
      window.location.assign("/");
    });
  }

  return (
    <>
      <div className="link">
        {messages.length > 0 && <div className="unread-icon"></div>}
        <HelpBox
          placement="left"
          name={helpboxNames.userIcon}
          text={Translated.byKey("userIconHelpbox")}
          show={authenticated()}
        >
          <img src="https://drulpact.sirv.com/sp/user.svg" width="35px" />
        </HelpBox>
        <div className="menu">
          <Link to={"/profile/" + user.info?.id} className="item">
            {user?.info?.name}
          </Link>
          <Link to="/inbox" className="item">
            {Translated.byKey("inbox")}
          </Link>
          <a onClick={onLogout} className="item">
            {Translated.byKey("logout")}
          </a>
        </div>
      </div>
      <MessageNotification
        open={messageNotificationOpen}
        changeOpen={(open) => setMessageNotificationOpen(open)}
        messages={messages}
      />
    </>
  );
};

const MobileActions: FunctionComponent<unknown> = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();

  const { messages, messageNotificationOpen, setMessageNotificationOpen } =
    useMessages();

  function authenticated() {
    return user && user.authenticated === true;
  }

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
      window.location.assign("/");
    });
  }

  return (
    <>
      <div className="link">
        {messages.length > 0 && <div className="unread-icon"></div>}
        <HelpBox
          placement="left"
          name={helpboxNames.userIcon}
          text={Translated.byKey("userIconHelpbox")}
          show={authenticated()}
        >
          <img
            id="navigation-user-icon"
            src="https://drulpact.sirv.com/sp/user.svg"
            width="35px"
            onClick={() => setOpen(true)}
          />
        </HelpBox>
        <MessageNotification
          open={messageNotificationOpen}
          changeOpen={(open) => setMessageNotificationOpen(open)}
          messages={messages}
        />
        <div className="menu">
          <Link to={"/profile/" + user.info?.id} className="item">
            {user?.info?.name}
          </Link>
          <Link to="/inbox" className="item">
            {Translated.byKey("inbox")}
          </Link>
          <a onClick={onLogout} className="item">
            {Translated.byKey("logout")}
          </a>
        </div>
        <Menu
          anchorEl={document.getElementById("navigation-user-icon")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Link to={"/profile/" + user.info?.id} className="item">
            <ListItem button>
              <ListItemText>{user?.info?.name}</ListItemText>
            </ListItem>
          </Link>
          <Link to="/inbox" className="item">
            <ListItem button>
              <ListItemText>{Translated.byKey("inbox")}</ListItemText>
            </ListItem>
          </Link>
          <Link to="#" onClick={onLogout} className="item">
            <ListItem button>
              <ListItemText>{Translated.byKey("logout")}</ListItemText>
            </ListItem>
          </Link>
        </Menu>
      </div>
    </>
  );
};

export { Actions, MobileActions };
