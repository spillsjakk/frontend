import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { HelpBox, helpboxNames } from "../../../../components/help-box";
import Translated from "../../../../components/translated";
import { useClub } from "../../../../context/club";
import style from "../style.module.scss";

const DetailSummaryContent: FunctionComponent<{}> = () => {
  const club = useClub();
  return (
    <>
      {club && (
        <HelpBox
          placement="bottom"
          name={helpboxNames.clubManageDetail}
          text={Translated.byKey("clubManageDetailHelpbox")}
          show={true}
        >
          <>
            <div className={style.label}>
              {Translated.byKey("manageClub_clubsName")}
            </div>
            <div>{club.name}</div>
            <div className={style.label}>
              {Translated.byKey("manageClub_clubsId")}
            </div>
            <div>
              <Link to={`/club/view/${club.id}`}>
                spillsjakk.no/club/view/{club.id}
              </Link>
            </div>
            <div className={style.label}>
              {Translated.byKey("manageClub_aboutClub")}
            </div>
            <div className={style["scroll-max-70"]}>{club.description}</div>
          </>
        </HelpBox>
      )}
    </>
  );
};

export { DetailSummaryContent };
