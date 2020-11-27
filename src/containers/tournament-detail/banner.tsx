import React, { FunctionComponent } from "react";
import { useOrganization } from "../../context/organization";
import style from "./style.module.scss";

const Banner: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  function getProfilePicture() {
    if (organization && organization.profile_picture) {
      return (
        <img
          className={style["pp-custom"]}
          src={organization.profile_picture}
        />
      );
    }
    return (
      <img className={style.pp} src="/images/tournament/pp-placeholder.png" />
    );
  }
  return (
    <div className={style.banner}>
      <img
        className={style["banner-pic"]}
        src={"/images/tournament/banner-placeholder.png"}
      />
      {getProfilePicture()}
    </div>
  );
};
export { Banner };
