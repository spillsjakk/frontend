import React from 'react';
import ReactDOM from 'react-dom';
import Translated from './components/Translated';

export function fetchJson(url: string, method: string, body: any | undefined, handler: (_: any) => void) {
  return fetch(url, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (response.status < 400) {
        return response.json();
      } else {
        return Promise.resolve({ error: response.status.toString() });
      }
    }).then(json => {
      if (!json.error) {
        handler(json);
      } else {
        let err: string = json.error;
        ReactDOM.render(<>{err}</>, document.getElementById("error"));
      }
    }).catch(err => {
      ReactDOM.render(<>{err.toString()}</>, document.getElementById("error"));
    })
}

export function title(key: string) {
  return Translated.byKey(key) + " | " + Translated.byKey("productName");
}