import React, { FunctionComponent } from "react";
import "./style.scss";

const Logo: FunctionComponent<{}> = () => {
  return (
    <div id="logo-container">
      <div>
        <img src="/dark-horse-icon.svg" alt="logo" />
      </div>
    </div>
  );
};
export { Logo };
