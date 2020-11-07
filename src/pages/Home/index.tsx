import React, { FunctionComponent, useEffect } from "react";
import "./style.css";
import { Home as HomeContainer } from "../../containers/home/index";

const Home: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "home";
  }, []);
  return (
    <div
      style={{
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <HomeContainer />
    </div>
  );
};
export { Home };
