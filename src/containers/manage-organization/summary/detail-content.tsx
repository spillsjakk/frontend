import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import { useOrganization } from "../../../context/organization";
import style from "../style.module.scss";

const DetailSummaryContent: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  return (
    <>
      {organization && (
        <>
          <div className={style.label}>
            {Translated.byKey("manageOrg_orgsName")}
          </div>
          <div>{organization.name}</div>
          <div className={style.label}>
            {Translated.byKey("manageOrg_orgsId")}
          </div>
          <div>
            <a href={`spillsjakk.no/organization/view/${organization.id}`}>
              spillsjakk.no/organization/view/{organization.id}
            </a>
          </div>
          <div className={style.label}>
            {Translated.byKey("manageOrg_aboutOrg")}
          </div>
          <div>{organization.description}</div>
        </>
      )}
    </>
  );
};

export { DetailSummaryContent };
