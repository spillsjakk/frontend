import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../components/Translated";

class NotFound extends PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>About</title>
        </Helmet>
        <h1>
          <Translated str="about" />
        </h1>
        <p className="mt-5">
          ...
        </p>
      </>
    );
  }
}

export default NotFound;