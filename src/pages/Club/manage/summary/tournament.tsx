import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../../components/translated";
import { fetchJson } from "../../../../functions";
import style from "../style.module.scss";

export const TournamentList: FunctionComponent<{}> = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchJson(`/s/tournament/template/list`, "GET", undefined, (result) => {
      setList(result);
    });
  }, []);
  return (
    <div>
    <div className={style.label} style={{marginLeft: "10px"}}>{Translated.byKey("savedtournaments")}</div>
    <div className={style.items}>
      {list.map((i) => (
        <div key={i} className={style.item}>
          <p className={style.savedlist}>{i.name}</p>
        </div>
      ))}
      </div>
    </div>
  );
};
