import React, { FunctionComponent, useEffect, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../../components/translated";
import { useManageClubPopup } from "../../../../context/manage-club-popup";
import { useClub } from "../../../../context/club";
import { fetchJson } from "../../../../functions";
import { Editor } from "../../../../components/markdown";

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

const EditForm: FunctionComponent<{}> = () => {
  const [orgName, setOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerPhoto, setBannerPhoto] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");

  const { close } = useManageClubPopup();
  const club = useClub();

  useEffect(() => {
    if (club) {
      setOrgName(club.name || "");
      setDescription(club.description || "");
      setBannerPhoto(club.banner_picture || "");
      setProfilePhoto(club.profile_picture || "");
      setAddress(club.address || "");
      setWebsite(club.website || "");
      setEmail(club.email || "");
    }
  }, [club]);

  function save() {
    fetchJson(
      `/s/club/edit/${club.id}`,
      "POST",
      {
        name: orgName,
        description,
        profile_picture: profilePhoto,
        banner_picture: bannerPhoto,
        address,
        website,
        email,
      },
      () => {
        close();
        club.updateData!();
      }
    );
  }

  return (
    <div id={style["edit-form"]}>
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

        <Editor
          value={description}
          height={150}
          onChange={(value: string) => setDescription(value)}
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
          {Translated.byKey("saveUpdates").toUpperCase()}
        </button>
      </form>
    </div>
  );
};

export { EditForm };
