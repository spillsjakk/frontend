import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import { useOrganization } from "../../../context/organization";
import style from "../style.module.scss";

const StatsSummary: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  return (
    <>
      <div className={style.label}>
        {Translated.byKey("manageOrg_totalClubCount")}
      </div>
      {organization && Array.isArray(organization.clubs) && (
        <div>{organization.clubs.length}</div>
      )}
      <div className={style.label}>
        {Translated.byKey("manageOrg_totalPlayerCount")}
      </div>
      {organization && Array.isArray(organization.accounts) && (
        <div>{organization.accounts.length}</div>
      )}
    </>
  );
};

export { StatsSummary };
