import React, { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { HelpBox, helpboxNames } from "../../../../components/help-box";
import Translated from "../../../../components/translated";
import { useClub } from "../../../../context/club";
import style from "../style.module.scss";
import xssFilters from "xss-filters";
import UserLink from "../../../../components/UserLink";

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
              {Translated.byKey("manageClub_clubsManager")}
            </div>
            <UserLink id={club.manager} name={club.manager} ghost={false} />
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
            <ReactMarkdown
              linkTarget="_blank"
              className={style["scroll-max-70"]}
            >
              {xssFilters.inHTMLData(club.description || "")}
            </ReactMarkdown>
          </>
        </HelpBox>
      )}
    </>
  );
};

export { DetailSummaryContent };
