import React, { FunctionComponent, useEffect } from "react";
import "./style.scss";

const Home: FunctionComponent<{}> = () => {
  useEffect(() => {
    document.getElementsByTagName("body")[0].id = "home";
  }, []);
  return <></>;
};
export { Home };
