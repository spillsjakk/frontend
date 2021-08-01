import React, { FunctionComponent } from "react";
import xssFilters from "xss-filters";
import ReactMarkdown from "react-markdown";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";

const Description: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style["description-container"]}>
      <div className={style.about}>
        <ReactMarkdown linkTarget="_blank">
          {xssFilters.inHTMLData(league?.description || "")}
        </ReactMarkdown>
      </div>
    </div>
  );
};
export { Description };
