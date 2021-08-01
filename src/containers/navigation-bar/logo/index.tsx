import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import "./style.scss";

const Logo: FunctionComponent<{}> = () => {
  const history = useHistory();
  return (
    <div id="logo-container" onClick={() => history.push("/")}>
      <div>
        <img
          src="https://drulpact.sirv.com/sp/dark-horse-icon.svg"
          alt="logo"
        />
      </div>
    </div>
  );
};
export { Logo };
