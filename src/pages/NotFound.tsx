import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import Translated from "../components/Translated";

class NotFound extends PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>Not found</title>
        </Helmet>
        <p className="mt-5" { ...{ "align": "center" }}>
          <Translated str="pageNotFound" />
        </p>
      </>
    );
  }
}

export default NotFound;