import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';
import { title } from "../functions";

class Contact extends PureComponent {
  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Contact";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("contact")}</title>
        </Helmet>
        <p className="mt-5">
          <strong>Kontakt SkoleSjakken</strong>
        </p>
        <p>
          Jorunn Brekke<br />
          Prosjektleder<br />
          Epost: <a href="mailto:jorunn%40sjakk.no">jorunn@sjakk.no</a><br />
          Telefon: 948 222 86
        </p>
      </>
    );
  }
}

export default Contact;