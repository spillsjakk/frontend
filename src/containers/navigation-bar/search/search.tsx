import React, { FunctionComponent } from "react";
import "./search.scss";

const SearchInput: FunctionComponent<{}> = () => {
  return (
    <div id="search-container">
      <input type="search" />
      <img src="/icons/search.svg" />
    </div>
  );
};
export { SearchInput };
