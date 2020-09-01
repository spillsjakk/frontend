import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../components/Translated";
import { title } from "../functions";

class About extends PureComponent {
  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "About";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("about")}</title>
        </Helmet>
        <h1 className="mt-4 p-3">
          <Translated str="about" />
        </h1>
        <p className="mt-5">
          ...
        </p>
      </>
    );
  }
}

export default About;