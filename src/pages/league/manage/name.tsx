import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";
import { League } from "./league";

const Name: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{league?.name}</div>

      <div className={style.organiser}></div>
      <League />
    </div>
  );
};
export { Name };
