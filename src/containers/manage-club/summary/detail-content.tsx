import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import { useClub } from "../../../context/club";
import style from "../style.module.scss";

const DetailSummaryContent: FunctionComponent<{}> = () => {
  const club = useClub();
  return (
    <>
      {club && (
        <>
          <div className={style.label}>
            {Translated.byKey("manageClub_clubsName")}
          </div>
          <div>{club.name}</div>
          <div className={style.label}>
            {Translated.byKey("manageClub_clubsId")}
          </div>
          <div>
            <a href={`/club/view/${club.id}`}>
              spillsjakk.no/club/view/{club.id}
            </a>
          </div>
          <div className={style.label}>
            {Translated.byKey("manageClub_aboutClub")}
          </div>
          <div>{club.description}</div>
        </>
      )}
    </>
  );
};

export { DetailSummaryContent };
