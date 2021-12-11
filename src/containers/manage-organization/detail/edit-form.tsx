import React, { FunctionComponent, useEffect, useState } from "react";
import style from "../style.module.scss";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";
import { useOrganization } from "../../../context/organization";
import { useManageOrganizationPopup } from "../../../context/manage-organization-popup";
import { Button } from "@material-ui/core";
import { Editor } from "../../../components/markdown";

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

  const organization = useOrganization();
  const { close } = useManageOrganizationPopup();

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || "");
      setDescription(organization.description || "");
      setBannerPhoto(organization.banner_picture || "");
      setProfilePhoto(organization.profile_picture || "");
      setAddress(organization.address || "");
      setWebsite(organization.website || "");
      setEmail(organization.email || "");
    }
  }, [organization]);

  function save() {
    fetchJson(
      `/s/organization/edit/${organization.id}`,
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
        organization.updateData!();
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
          label={Translated.byKey("manageOrg_orgsName")}
          description={Translated.byKey("manageOrg_orgsNameDesc")}
          value={orgName}
          onChange={(value: string) => setOrgName(value)}
        />

        <Editor
          value={description}
          height={150}
          onChange={(value: string) => setDescription(value)}
        />

        <InputGroup
          label={Translated.byKey("manageOrg_bannerPhoto")}
          description={Translated.byKey("manageOrg_bannerPhotoDesc")}
          value={bannerPhoto}
          onChange={(value: string) => setBannerPhoto(value)}
        />

        <InputGroup
          label={Translated.byKey("manageOrg_profilePhoto")}
          description={Translated.byKey("manageOrg_profilePhotoDesc")}
          value={profilePhoto}
          onChange={(value: string) => setProfilePhoto(value)}
        />

        <InputGroup
          label={Translated.byKey("manageOrg_address")}
          description={Translated.byKey("manageOrg_addressDesc")}
          value={address}
          onChange={(value: string) => setAddress(value)}
          textArea
        />

        <InputGroup
          label={Translated.byKey("manageOrg_website")}
          description={Translated.byKey("manageOrg_websiteDesc")}
          value={website}
          onChange={(value: string) => setWebsite(value)}
        />

        <InputGroup
          label={Translated.byKey("manageOrg_email")}
          description={Translated.byKey("manageOrg_emailDesc")}
          value={email}
          onChange={(value: string) => setEmail(value)}
        />
        <Button variant="contained" color="primary" type="submit">
          {Translated.byKey("saveUpdates").toUpperCase()}
        </Button>
      </form>
    </div>
  );
};

export { EditForm };
