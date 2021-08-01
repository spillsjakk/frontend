import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Banner: FunctionComponent<{}> = () => {
  const { league } = useLeague();
  function getBannerPicture() {
    if (league && league.banner_picture) {
      return (
        <img
          className={style["banner-pic"]}
          alt="banner"
          src={league.banner_picture}
        />
      );
    }
    return (
      <img
        className={style["banner-pic"]}
        alt="banner"
        src={"https://drulpact.sirv.com/Images/sp/banner-placeholder-min.png"}
      />
    );
  }
  function getProfilePicture() {
    if (league && league.profile_picture) {
      return (
        <img
          className={style["pp-custom"]}
          alt="profile"
          src={league.profile_picture}
        />
      );
    }
    return (
      <img
        className={style.pp}
        alt="profile placeholder"
        src="https://drulpact.sirv.com/Images/sp/pp-placeholder-min.png"
      />
    );
  }
  return (
    <div className={style.banner}>
      {getBannerPicture()}
      {getProfilePicture()}
    </div>
  );
};
export { Banner };
