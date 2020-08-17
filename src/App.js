import React from 'react';
import Main from './Main';

import { Container } from "react-bootstrap";

import Menu from './components/Menu';

function App() {
  return (
    <>
      <Menu />
      <Container>
        <Main />
      </Container>
    </>
  );
}

export default App;
