import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
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
            <Link to={`/organization/view/${organization.id}`}>
              spillsjakk.no/organization/view/{organization.id}
            </Link>
          </div>
          <div className={style.label}>
            {Translated.byKey("manageOrg_aboutOrg")}
          </div>
          <div className={style["scroll-max-70"]}>
            {organization.description}
          </div>
        </>
      )}
    </>
  );
};

export { DetailSummaryContent };
