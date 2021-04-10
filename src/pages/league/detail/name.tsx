import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Name: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style["name-container"]}>
      <div className={style.name}>{league?.name}</div>
      {/*
      <div className={style.organiser}>
        organiser:{" "}
        <UserLink
          id={tournament?.organizer || ""}
          name={organizer_first_name + " " + organizer_last_name}
          ghost={false}
        />
      </div> */}
    </div>
  );
};
export { Name };
