import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import Translated from "../components/Translated";
import { title } from "../functions";

class NotFound extends PureComponent {
  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "NotFound";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("pageNotFound")}</title>
        </Helmet>
        <p className="mt-5" { ...{ "align": "center" }}>
          <Translated str="pageNotFound" />
        </p>
      </>
    );
  }
}

export default NotFound;