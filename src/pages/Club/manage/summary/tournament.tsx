import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../../components/translated";
import { fetchJson } from "../../../../functions";
import style from "../style.module.scss";
import { Delete } from "@material-ui/icons";

export const TournamentList: FunctionComponent<{}> = () => {
  const [list, setList] = useState([]);

  function fetchTemplateList() {
    fetchJson(`/s/tournament/template/list`, "GET", undefined, (result) => {
      setList(result);
    });
  }

  useEffect(() => {
    fetchTemplateList();
  }, []);

  function removeList(id: string) {
    fetchJson(`/s/tournament/template/${id}`, "DELETE", undefined, () => {
      fetchTemplateList();
    });
  }

  return (
    <div>
      <div className={style.label} style={{ marginLeft: "10px" }}>
        {Translated.byKey("savedtournament")}
      </div>
      <div className={style.items}>
        {list.map((i) => (
          <div key={i} className={style.item}>
            <p className={style.savedlist}>{i.name}</p>
            <div>
              <a style={{cursor: "pointer"}} onClick={() => removeList(i.id)}>
                <Delete color="action" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
