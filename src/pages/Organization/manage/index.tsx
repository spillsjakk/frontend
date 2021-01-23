import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import "./style.scss";
import { ManageOrganization } from "../../../containers/manage-organization";
import { WithManageOrganization } from "../../../hocs/with-manage-organization";
import { WithManageOrganizationPopup } from "../../../hocs/with-manage-organization/popup";
import { fetchCall } from "../../../functions";

const ManageOrganizationPage: FunctionComponent<{}> = () => {
  const [organizations, setOrganizations] = useState<Array<string>>();
  const [selectedOrganization, setSelectedOrganization] = useState<string>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "organization-manage";
    fetchCall("/s/account/organizations", "GET", undefined, (response) => {
      if (Array.isArray(response)) {
        if (response.length === 1) {
          setSelectedOrganization(response[0]);
        }
        setOrganizations(response);
      }
    });
  }, []);
  return (
    <main>
      <header>
        <h1 className="text">
          {Translated.byKey("manageOrganization").toUpperCase()}
        </h1>
      </header>
      {!selectedOrganization && Array.isArray(organizations) && (
        <div>
          {organizations.map((organization, i) => (
            <div key={i} className="org-box">
              <div>
                <strong>{organization}</strong>
              </div>
              <button onClick={() => setSelectedOrganization(organization)}>
                {Translated.byKey("continue")}
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedOrganization && (
        <WithManageOrganization id={selectedOrganization}>
          <WithManageOrganizationPopup>
            <ManageOrganization />
          </WithManageOrganizationPopup>
        </WithManageOrganization>
      )}
    </main>
  );
};

export { ManageOrganizationPage };
