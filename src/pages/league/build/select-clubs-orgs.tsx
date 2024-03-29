import React, { useState } from "react";
import { useOrgsClubs } from "../../../hocs/user-orgs-and-clubs/index";
import { NativeSelect } from "@material-ui/core";
import Translated from "../../../components/translated";
import style from "./style.module.scss";
import { useLeagueForm } from "./with-form";

export function SelectClubOrg({ disabled = false }) {
  const [type, setType] = useState("organization");
  const form = useLeagueForm();
  const { orgs, clubs } = useOrgsClubs();
  return (
    <div className={style.select}>
      <div className={style.inputs}>
        <NativeSelect
          disabled={disabled}
          onChange={(e) => {
            const value = e.target.value;
            if (orgs.find((org) => org.id === value)) {
              setType("organization");
              form.changeOrganization(value as string);
            } else {
              setType("club");
              form.changeClub(value as string);
            }
          }}
          value={type === "organization" ? form.organization : form.club}
          required
        >
          <option value="" disabled>
            {Translated.byKey("buildTournament_pleaseSelectOrganiser")}
          </option>
          {Array.isArray(orgs) &&
            orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          {Array.isArray(clubs) &&
            clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
        </NativeSelect>
      </div>
    </div>
  );
}
