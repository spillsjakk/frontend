import React, { FunctionComponent } from "react";
import { useTournamentDetail } from "../../../context/tournament-detail";
import style from "./style.module.scss";

const Banner: FunctionComponent<{}> = () => {
  const { tournament } = useTournamentDetail();
  function getBannerPicture() {
    if (tournament && tournament.banner_picture) {
      return (
        <img
          className={style["banner-pic"]}
          alt="banner"
          src={tournament.banner_picture}
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
    if (tournament && tournament.profile_picture) {
      return (
        <img
          className={style["pp-custom"]}
          src={tournament.profile_picture}
          alt="profile"
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
