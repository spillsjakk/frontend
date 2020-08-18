import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/contact' component={Contact}></Route>
      <Route component={NotFound}></Route>
    </Switch>
  );
}

export default Main;