import React, { FunctionComponent } from "react";
import { useOrganization } from "../../../context/organization";
import style from "../style.module.scss";

const StatsSummary: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  return (
    <>
      <div className={style.label}>Total Club Count:</div>
      {organization && Array.isArray(organization.clubs) && (
        <div>{organization.clubs.length}</div>
      )}
      <div className={style.label}>Total Player Count:</div>
      {organization && Array.isArray(organization.accounts) && (
        <div>{organization.accounts.length}</div>
      )}
    </>
  );
};

export { StatsSummary };
