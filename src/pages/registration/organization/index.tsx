import React, { FunctionComponent, useEffect, useState } from "react";
import style from "./style.module.scss";
import "./style.scss";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import FederationDropdown from "../../../components/FederationDropdown";
import { useHistory } from "react-router";

const InputGroup: FunctionComponent<{
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  textArea?: boolean;
}> = ({ label, description, value, onChange, textArea }) => (
  <div className={style.group}>
    <div className={style.label}>{label}</div>
    <div className={style.description}>{description}</div>
    {textArea && (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    )}
    {!textArea && (
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

const CreateOrganization: FunctionComponent<{}> = () => {
  const [orgName, setOrgName] = useState("");
  const [id, setId] = useState("");
  const [manager, setManager] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("NOR");

  const history = useHistory();

  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "registration-organization";
  }, []);

  function save() {
    fetchJson(
      `/s/organization/add`,
      "POST",
      {
        id,
        name: orgName,
        description,
        profile_picture: profilePicture,
        country,
        manager,
      },
      () => {
        history.push(`/organization/view/${id}`);
      }
    );
  }

  return (
    <div id={style.form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <InputGroup
          label={Translated.byKey("createOrg_name")}
          description={Translated.byKey("createOrg_nameDesc")}
          value={orgName}
          onChange={(value: string) => setOrgName(value)}
        />

        <InputGroup
          label={Translated.byKey("createOrg_id")}
          description={Translated.byKey("createOrg_idDesc")}
          value={id}
          onChange={(value: string) => setId(value)}
        />

        <InputGroup
          label={Translated.byKey("createOrg_desc")}
          description={Translated.byKey("createOrg_descDesc")}
          value={description}
          onChange={(value: string) => setDescription(value)}
          textArea
        />

        <InputGroup
          label={Translated.byKey("manageClub_profilePhoto")}
          description={Translated.byKey("manageClub_profilePhotoDesc")}
          value={profilePicture}
          onChange={(value: string) => setProfilePicture(value)}
        />

        <InputGroup
          label={Translated.byKey("createOrg_manager")}
          description={Translated.byKey("createOrg_managerDesc")}
          value={manager}
          onChange={(value: string) => setManager(value)}
        />

        <div className={style["input-group"]}>
          <div className={`${style.label} bold`}>
            {Translated.byKey("country")}
          </div>
          <FederationDropdown
            id="country"
            required
            className="form-control w-25"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <button type="submit">
          {Translated.byKey("create").toUpperCase()}
        </button>
      </form>
    </div>
  );
};

export { CreateOrganization };
