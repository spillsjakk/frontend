import React, { FunctionComponent } from "react";
import xssFilters from "xss-filters";
import style from "./style.module.scss";
import { useLeague } from "../../../hocs/with-league/index";
import ReactMarkdown from "react-markdown";

const Description: FunctionComponent<{}> = () => {
  const { league } = useLeague();

  return (
    <div className={style.about}>
      <ReactMarkdown linkTarget="_blank">
        {xssFilters.inHTMLData(league?.description || "")}
      </ReactMarkdown>
    </div>
  );
};

export { Description };
