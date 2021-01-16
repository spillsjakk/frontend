import React, { FunctionComponent, useState } from "react";
import style from "./style.module.scss";
import Translated from "../../../../components/translated";
import { fetchJson } from "../../../../functions";
import FederationDropdown from "../../../../components/FederationDropdown";
import { useHistory } from "react-router-dom";
import { useInvitation } from "../../../../context/invitation";

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

const Form: FunctionComponent<{}> = () => {
  const [orgName, setOrgName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [bannerPhoto, setBannerPhoto] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("NOR");
  const [region, setRegion] = useState("");

  const { invitation } = useInvitation();
  const history = useHistory();

  function save() {
    fetchJson(
      `/s/registrations/clubs`,
      "POST",
      {
        id,
        name: orgName,
        description,
        profile_picture: profilePhoto,
        banner_picture: bannerPhoto,
        address,
        website,
        email,
        country,
        region,
        invitation_id: invitation.id,
      },
      () => {
        history.push(`/club/manage`);
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
          label={Translated.byKey("manageClub_clubsName")}
          description={Translated.byKey("manageClub_clubsNameDesc")}
          value={orgName}
          onChange={(value: string) => setOrgName(value)}
        />

        <InputGroup
          label={Translated.byKey("manageClub_clubsId")}
          description={Translated.byKey("manageClub_clubsIdDesc")}
          value={id}
          onChange={(value: string) => setId(value)}
        />

        <InputGroup
          label={Translated.byKey("manageClub_aboutClub")}
          description={Translated.byKey("manageClub_aboutClubDesc")}
          value={description}
          onChange={(value: string) => setDescription(value)}
          textArea
        />

        <InputGroup
          label={Translated.byKey("manageClub_bannerPhoto")}
          description={Translated.byKey("manageClub_bannerPhotoDesc")}
          value={bannerPhoto}
          onChange={(value: string) => setBannerPhoto(value)}
        />

        <InputGroup
          label={Translated.byKey("manageClub_profilePhoto")}
          description={Translated.byKey("manageClub_profilePhotoDesc")}
          value={profilePhoto}
          onChange={(value: string) => setProfilePhoto(value)}
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

        {country === "NOR" && (
          <div className={style["input-group"]}>
            <div className={`${style.label} bold`}>
              {Translated.byKey("region")}
            </div>
            <select
              id="region"
              className="form-control w-25"
              required
              name="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value=""></option>
              <option value="Oslo">Oslo</option>
              <option value="Rogaland">Rogaland</option>
              <option value="Møre og Romsdal">Møre og Romsdal</option>
              <option value="Nordland">Nordland</option>
              <option value="Viken">Viken</option>
              <option value="Innlandet">Innlandet</option>
              <option value="Vestfold og Telemark">Vestfold og Telemark</option>
              <option value="Agder">Agder</option>
              <option value="Vestland">Vestland</option>
              <option value="Trøndelag">Trøndelag</option>
              <option value="Troms og Finnmark">Troms og Finnmark</option>
            </select>
          </div>
        )}

        <InputGroup
          label={Translated.byKey("manageClub_address")}
          description={Translated.byKey("manageClub_addressDesc")}
          value={address}
          onChange={(value: string) => setAddress(value)}
          textArea
        />

        <InputGroup
          label={Translated.byKey("manageClub_website")}
          description={Translated.byKey("manageClub_websiteDesc")}
          value={website}
          onChange={(value: string) => setWebsite(value)}
        />

        <InputGroup
          label={Translated.byKey("manageClub_email")}
          description={Translated.byKey("manageClub_emailDesc")}
          value={email}
          onChange={(value: string) => setEmail(value)}
        />
        <button type="submit">
          {Translated.byKey("create").toUpperCase()}
        </button>
      </form>
    </div>
  );
};

export { Form };
