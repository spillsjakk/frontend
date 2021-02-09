import React, { FunctionComponent } from "react";
import { Features } from "./features";
import { Tournaments } from "./tournaments";
import style from "./style.module.scss";
import Translated from "../../components/translated";
import { HelpBox, helpboxNames } from "../../components/help-box";
import { useUser } from "../../components/UserContext";

const Home: FunctionComponent<{}> = () => {
  const { user } = useUser();
  return (
    <div className={style["home-container"]}>
      <div className={style["features-container"]}>
        <div className={style.header}>
          <Translated str="featuresWeOffer" />
        </div>
        <Features />
      </div>
      <HelpBox
        placement="top"
        name={helpboxNames.homeTournaments}
        text={Translated.byKey("homeTournamentsHelpbox")}
        show={user && user.authenticated === true}
      >
        <div className={style["tournaments-container"]}>
          <div className={style.header}>
            <Translated str="liveAndUpcomingTournaments" />
          </div>
          <Tournaments />
        </div>
      </HelpBox>
    </div>
  );
};

export { Home };
