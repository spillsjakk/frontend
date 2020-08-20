import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TournamentView from './pages/Tournament/View';
import TournamentBuild from './pages/Tournament/Build';
import TournamentPlayers from './pages/Tournament/Players';
import TournamentSearch from './pages/Tournament/Search';
import TournamentFind from './pages/Tournament/Find';
import TournamentTeamPlayers from './pages/Tournament/TeamPlayers';
import TeamView from './pages/Team/View';
import TeamMine from './pages/Team/Mine';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/about' component={About}></Route>
      <Route exact path='/contact' component={Contact}></Route>
      <Route exact path='/login' component={Login}></Route>

      <Route exact path='/profile/:uid' component={Profile}></Route>

      <Route exact path='/tournament/view/:tid' component={TournamentView}></Route>
      <Route exact path='/tournament/build' component={TournamentBuild}></Route>
      <Route exact path='/tournament/players/:tid' component={TournamentPlayers}></Route>
      <Route exact path='/tournament/search' component={TournamentSearch}></Route>
      <Route exact path='/tournament/find' component={TournamentFind}></Route>
      <Route exact path='/tournament/manage-team/:tournamentId/:teamId' component={TournamentTeamPlayers}></Route>

      <Route exact path='/team/view/:tid' component={TeamView}></Route>
      <Route exact path='/team/mine' component={TeamMine}></Route>

      <Route component={NotFound}></Route>
    </Switch>
  );
}

export default Main;