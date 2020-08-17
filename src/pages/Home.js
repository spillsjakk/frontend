import React, { PureComponent } from "react";
import { Helmet } from 'react-helmet';

class Home extends PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>Home page</title>
        </Helmet>
        <p>
          This is the homepage.
        </p>
      </>
    );
  }
}

export default Home;