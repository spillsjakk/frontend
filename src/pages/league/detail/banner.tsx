import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Banner: FunctionComponent<{}> = () => {
  const { league } = useLeague();
  function getBannerPicture() {
    if (league && league.banner_picture) {
      return (
        <img className={style["banner-pic"]} src={league.banner_picture} />
      );
    }
    return (
      <img
        className={style["banner-pic"]}
        src={"/images/tournament/banner-placeholder.png"}
      />
    );
  }
  function getProfilePicture() {
    if (league && league.profile_picture) {
      return (
        <img className={style["pp-custom"]} src={league.profile_picture} />
      );
    }
    return (
      <img className={style.pp} src="/images/tournament/pp-placeholder.png" />
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
