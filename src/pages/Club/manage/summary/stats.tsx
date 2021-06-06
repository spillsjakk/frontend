import React, { FunctionComponent } from "react";
import { HelpBox, helpboxNames } from "../../../../components/help-box";
import Translated from "../../../../components/translated";
import { useClub } from "../../../../context/club";
import style from "../style.module.scss";

const StatsSummary: FunctionComponent<{}> = () => {
  const club = useClub();
  return (
    <HelpBox
      placement="bottom"
      name={helpboxNames.clubManageStats}
      text={Translated.byKey("clubManageStatsHelpbox")}
      show={true}
    >
      <>
        <div className={style.label}>
          {Translated.byKey("manageClub_totalTeamCount")}
        </div>
        {club && Array.isArray(club.teams) && (
          <div>
            {club.teams.length} {Translated.byKey("teams")}
          </div>
        )}
        <div className={style.label}>
          {Translated.byKey("manageClub_totalPlayerCount")}
        </div>
        {club && Array.isArray(club.members) && (
          <div>
            {club.members.length} {Translated.byKey("players")}
          </div>
        )}
      </>
    </HelpBox>
  );
};

export { StatsSummary };
