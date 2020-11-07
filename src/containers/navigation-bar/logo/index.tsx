import React, { FunctionComponent } from "react";
import "./style.scss";

const Logo: FunctionComponent<{}> = () => {
  return (
    <div id="logo-container">
      <img src="/icons/logos/platform.png" alt="logo" />
      <span>
        Spill<b>Sjakk</b>
      </span>
    </div>
  );
};
export { Logo };
