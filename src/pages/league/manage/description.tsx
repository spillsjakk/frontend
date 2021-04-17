import React, { FunctionComponent } from "react";
import xssFilters from "xss-filters";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Description: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div
      className={style.about}
      dangerouslySetInnerHTML={{
        __html: xssFilters.inHTMLData(league?.description || ""),
      }}
    ></div>
  );
};
export { Description };
