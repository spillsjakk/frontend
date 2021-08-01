import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

const Banner: FunctionComponent<{
  profilePicture: string;
  bannerPicture: string;
  name: string;
}> = ({ profilePicture, bannerPicture, name }) => {
  function getBannerPicture() {
    if (bannerPicture) {
      return <img className={style["banner-pic"]} src={bannerPicture} />;
    }
    return (
      <img
        className={style["banner-pic"]}
        src={"https://drulpact.sirv.com/Images/sp/banner-placeholder-min.png"}
      />
    );
  }
  function getProfilePicture() {
    if (profilePicture) {
      return <img className={style["pp-custom"]} src={profilePicture} />;
    }
    return (
      <img
        className={style.pp}
        src="https://drulpact.sirv.com/Images/sp/pp-placeholder-min.png"
      />
    );
  }
  return (
    <>
      <div className={style.banner}>
        {getBannerPicture()}
        {getProfilePicture()}
      </div>
      <div className={style["name-container"]}>
        <div className={style.name}>{name}</div>
      </div>
    </>
  );
};
export { Banner };
