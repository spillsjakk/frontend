import React, { FunctionComponent } from "react";
import "./style.scss";
import { Logo } from "./logo/logo";
import { SearchInput } from "./search/search";

const NavigationBar: FunctionComponent<{}> = () => {
  return (
    <nav id="main">
      <Logo />
      <SearchInput />
      <div className="options-container">{/* options component */}</div>
      <div className="user-container">{/* user component */}</div>
    </nav>
  );
};
export { NavigationBar };
