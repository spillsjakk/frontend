import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

const Banner: FunctionComponent<{}> = () => {
  return (
    <div className={style.banner}>
      <img
        className={style["banner-pic"]}
        src="/images/tournament/banner-placeholder.png"
      />
      <img className={style.pp} src="/images/tournament/pp-placeholder.png" />
    </div>
  );
};
export { Banner };
