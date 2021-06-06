import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import "./style.scss";
import { ManageClub } from "./container";
import { WithManageClub } from "../../../hocs/with-manage-club";
import { WithManageClubPopup } from "../../../hocs/with-manage-club/popup";
import { fetchCall } from "../../../functions";

const ManageClubPage: FunctionComponent<{}> = () => {
  const [clubs, setClubs] = useState<Array<string>>();
  const [selectedClub, setSelectedClub] = useState<string>();
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "club-manage";
    fetchCall("/s/account/clubs", "GET", undefined, (response) => {
      if (Array.isArray(response)) {
        if (response.length === 1) {
          setSelectedClub(response[0]);
        }
        setClubs(response);
      }
    });
  }, []);
  return (
    <main>
      <header>
        <h1 className="text">{Translated.byKey("manageClub").toUpperCase()}</h1>
      </header>
      {!selectedClub && Array.isArray(clubs) && (
        <div>
          {clubs.map((club, i) => (
            <div key={i} className="club-box">
              <div>
                <strong>{club}</strong>
              </div>
              <button onClick={() => setSelectedClub(club)}>
                {Translated.byKey("continue")}
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedClub && (
        <WithManageClub id={selectedClub}>
          <WithManageClubPopup>
            <ManageClub />
          </WithManageClubPopup>
        </WithManageClub>
      )}
    </main>
  );
};

export { ManageClubPage };
