import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Translated from "../../components/translated";
import { useUser } from "../../components/UserContext";
import { fetchJson } from "../../functions";
import { HelpBox, helpboxNames } from "../../components/help-box";
import { ListItem, ListItemText, Menu } from "@material-ui/core";

const Actions: FunctionComponent<unknown> = () => {
  const [hasMessage, setHasMessage] = useState(false);

  const { user, setUser } = useUser();

  // required for rendering when route is changed
  useParams();

  useEffect(() => {
    if (user && user.authenticated) {
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
          if (!json.error) {
            setHasMessage(!!json.has);
          }
        });
    }
  }, [user]);

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
      window.location.assign("/");
    });
  }

  function authenticated() {
    return user && user.authenticated === true;
  }

  return (
    <>
      <div className="link">
        {hasMessage && <div className="unread-icon"></div>}
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
    </>
  );
};

const MobileActions: FunctionComponent<unknown> = () => {
  const [open, setOpen] = useState(false);
  const [hasMessage, setHasMessage] = useState(false);

  const { user, setUser } = useUser();

  // required for rendering when route is changed
  useParams();

  useEffect(() => {
    if (user && user.authenticated) {
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
          if (!json.error) {
            setHasMessage(!!json.has);
          }
        });
    }
  }, [user]);

  function onLogout() {
    fetchJson("/s/account/logout", "POST", {}, (_) => {
      setUser({ authenticated: false });
      window.location.assign("/");
    });
  }

  function authenticated() {
    return user && user.authenticated === true;
  }

  return (
    <>
      <div className="link">
        {hasMessage && <div className="unread-icon"></div>}
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
