import React from "react";
import ReactDOM from "react-dom";
import Translated from "./components/translated";
import { KIND } from "./constants";

const FORCE_RELOAD = "forceReload";

function checkForceReload(error: string) {
  if (error === "502" && !window.location.hash.includes(FORCE_RELOAD)) {
    window.location.hash = FORCE_RELOAD;
    window.location.reload();
  }
}

type ErrorProps = {
  err: string;
};

export function ErrorComponent(props: ErrorProps) {
  return (
    <div
      style={{
        backgroundColor: "darkred",
        color: "white",
        padding: "20px",
        textAlign: "center",
        fontSize: "1.1em",
        position: "fixed",
        top: "0.5em",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: 999,
        borderRadius: "15px",
        maxWidth: "25%",
      }}
    >
      {props.err}&nbsp;
      <strong
        style={{
          cursor: "pointer",
          border: "1px solid white",
          padding: "5px",
        }}
        onClick={() =>
          ReactDOM.unmountComponentAtNode(document.getElementById("error")!)
        }
      >
        X
      </strong>
    </div>
  );
}

export function fetchJson(
  url: string,
  method: string,
  body: any | undefined,
  handler: (_: any) => void
) {
  return fetch(url, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        console.error(e);
      }
      if (response.status < 400) {
        return data;
      } else {
        let error = response.status.toString();
        if (data.message) {
          error = data.message;
        }
        return Promise.resolve({ error });
      }
    })
    .then((json) => {
      if (!json.error) {
        handler(json);
      } else {
        const err: string = json.error;
        checkForceReload(String(err));
        ReactDOM.render(
          <>
            <ErrorComponent err={Translated.byKey(err)} />
          </>,
          document.getElementById("error")
        );
      }
    })
    .catch((err) => {
      checkForceReload(err.toString());
      ReactDOM.render(
        <>
          <ErrorComponent err={err.toString()} />
        </>,
        document.getElementById("error")
      );
    });
}

export function title(key: string) {
  return Translated.byKey(key) + " | " + Translated.byKey("productName");
}

export function fetchCall(
  url: string,
  method: string,
  body: any | undefined,
  onSuccess: (_: any) => void,
  onError?: (_: any) => void
) {
  return fetch(url, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status < 400) {
        return response.json();
      } else {
        return { error: response.status.toString() };
      }
    })
    .then((json) => {
      if (!json.error) {
        onSuccess(json);
      } else if (onError) {
        onError(json.error);
      }
    });
}

export function generateId(length: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function isTeam(kind: number) {
  return (
    kind === KIND.TeamKonrad ||
    kind === KIND.TeamRoundRobin ||
    kind === KIND.TeamSwissDutch
  );
}
