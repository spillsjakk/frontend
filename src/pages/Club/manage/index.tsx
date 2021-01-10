import React, { FunctionComponent, useEffect } from "react";
import Translated from "../../../components/translated";
import "./style.scss";
import { ManageClub } from "../../../containers/manage-club";
import { WithManageClub } from "../../../hocs/with-manage-club";
import { WithManageClubPopup } from "../../../hocs/with-manage-club/popup";

const ManageClubPage: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "club-manage";
  }, []);
  return (
    <main>
      <header>
        <h1 className="text">{Translated.byKey("manageClub").toUpperCase()}</h1>
      </header>
      <WithManageClub>
        <WithManageClubPopup>
          <ManageClub />
        </WithManageClubPopup>
      </WithManageClub>
    </main>
  );
};

export { ManageClubPage };
