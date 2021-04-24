import React, { FunctionComponent, useEffect } from "react";
import "./style.css";
import { Home as HomeContainer } from "./container";
import { Helmet } from "react-helmet";
import { title } from "../../functions";

const Home: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "home";
  }, []);
  return (
    <>
      <Helmet>
        <title>{title("home")}</title>
      </Helmet>
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
    </>
  );
};
export { Home };
