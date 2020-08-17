import React from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';
import LogoFooter from './components/LogoFooter';

function App() {
  return (
    <>
      <Container id="main-container">
        <Menu />
        <Container id="content-container">
          <Main />
        </Container>
      </Container>
      <LogoFooter />
    </>
  );
}

export default App;
