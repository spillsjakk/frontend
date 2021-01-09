import React, { FunctionComponent, useEffect } from "react";
import Translated from "../../../components/translated";
import "./style.scss";
import { ManageOrganization } from "../../../containers/manage-organization";
import { WithManageOrganization } from "../../../hocs/with-manage-organization";
import { WithManageOrganizationPopup } from "../../../hocs/with-manage-organization/popup";

const ManageOrganizationPage: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "organization-manage";
  }, []);
  return (
    <main>
      <header>
        <h1 className="text">
          {Translated.byKey("manageOrganization").toUpperCase()}
        </h1>
      </header>
      <WithManageOrganization>
        <WithManageOrganizationPopup>
          <ManageOrganization />
        </WithManageOrganizationPopup>
      </WithManageOrganization>
    </main>
  );
};

export { ManageOrganizationPage };
