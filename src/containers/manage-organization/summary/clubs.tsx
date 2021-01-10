import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import { useOrganization } from "../../../context/organization";
import { fetchJson } from "../../../functions";
import style from "../style.module.scss";

const ClubsSummary: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  function removeClub(id: string) {
    fetchJson(
      `/s/organization/remove-club/${organization.id}/${id}`,
      "POST",
      undefined,
      (_) => {
        organization.updateData!();
      }
    );
  }
  function addClub(clubName: string) {
    fetchJson(
      `/s/organization/add-club/${organization.id}/${clubName}`,
      "POST",
      undefined,
      () => {
        organization.updateData!();
      }
    );
  }
  return (
    <>
      <div className={style.label}>
        {Translated.byKey("manageOrg_orgsClubs")}
      </div>
      <InputAdd
        onAction={addClub}
        placeholder={Translated.byKey("addClubId")}
      />
      <div className={style.items}>
        {Array.isArray(organization.clubs) &&
          organization.clubs.map((club) => (
            <div key={club.id} className={style.item}>
              <div>
                <Link to={"/club/view/" + club.id}>{club.name}</Link>
              </div>
              <div>
                <a
                  className="btn btn-danger"
                  onClick={() => removeClub(club.id)}
                >
                  X
                </a>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export { ClubsSummary };
