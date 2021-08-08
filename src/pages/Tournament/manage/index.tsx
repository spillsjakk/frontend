import React, { FunctionComponent, useState } from "react";
import { useEffect } from "react-router/node_modules/@types/react";
import { fetchJson } from "../../../functions";
import { useParams } from "react-router-dom";

interface Props {}

const Manage: FunctionComponent<Props> = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { tid } = useParams<{ tid: string }>();
  function fetchTournament() {
    setLoading(true);
    fetchJson("/s/tournament/view/" + tid, "GET", undefined, (json) => {
      setInfo(json);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchTournament();
  }, []);

  return <></>;
};

export { Manage };
