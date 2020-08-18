import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Profile from './pages/Profile';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/about' component={About}></Route>
      <Route exact path='/contact' component={Contact}></Route>
      <Route exact path='/login' component={Login}></Route>
      <Route exact path='/profile/:uid' component={Profile}></Route>
      <Route component={NotFound}></Route>
    </Switch>
  );
}

export default Main;