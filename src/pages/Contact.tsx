import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';

class Contact extends PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>Home page</title>
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