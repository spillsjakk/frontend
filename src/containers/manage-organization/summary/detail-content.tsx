import React, { FunctionComponent } from "react";
import { useOrganization } from "../../../context/organization";
import style from "../style.module.scss";

const DetailSummaryContent: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  return (
    <>
      {organization && (
        <>
          <div className={style.label}>Organization’s name:</div>
          <div>{organization.name}</div>
          <div className={style.label}>Organization’s URL (SpillSjakk ID):</div>
          <div>
            <a href={`spillsjakk.no/organization/view/${organization.id}`}>
              spillsjakk.no/organization/view/{organization.id}
            </a>
          </div>
          <div className={style.label}>About the Organization:</div>
          <div>{organization.description}</div>
        </>
      )}
    </>
  );
};

export { DetailSummaryContent };
