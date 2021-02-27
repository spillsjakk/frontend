import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

interface Props {}

const Home: FunctionComponent<Props> = () => {
  return (
    <div id={style.home}>
      <div id={style.image}>
        <div className={style.pane}>
          <div className={`${style.title}`}>
            <div>Invite · Pair · Play</div>
            <div>on SpillSjakk</div>
            <div>
              An efficient pairing and playing tool for clubs and event
              organisers. Supporting online, over the board, or hybrid
              tournament and casual play.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Home };
