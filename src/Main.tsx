import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TournamentView from "./pages/Tournament/View";
import TournamentPlayers from "./pages/Tournament/Players";
import TournamentSearch from "./pages/Tournament/Search";
import TournamentFind from "./pages/Tournament/Find";
import TournamentTeamPlayers from "./pages/Tournament/TeamPlayers";
import TeamView from "./pages/Team/View";
import TeamManage from "./pages/Team/Manage";
import AccountCreate from "./pages/Account/Create";
import AccountRecover from "./pages/Account/Recover";
import AccountSettings from "./pages/Account/Settings";
import GameLobby from "./pages/Game/Lobby";
import GamePlay from "./pages/Game/Play";
import GameView from "./pages/Game/View";
import ClubManage from "./pages/Club/Manage";
import ClubView from "./pages/Club/View";
import OrgManage from "./pages/Organization/Manage";
import OrgAllAccounts from "./pages/Organization/AllAccounts";
import OrgStatistics from "./pages/Organization/Statistics";
import OrgView from "./pages/Organization/View";
import { BuildTournament } from "./pages/Tournament/build/index";
import { EditTournament } from "./pages/Tournament/edit/index";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/about" component={About}></Route>
      <Route exact path="/contact" component={Contact}></Route>
      <Route exact path="/login" component={Login}></Route>

      <Route exact path="/profile/:uid" component={Profile}></Route>

      <Route
        exact
        path="/tournament/view/:tid"
        component={TournamentView}
      ></Route>
      <Route exact path="/tournament/build" component={BuildTournament}></Route>
      <Route
        exact
        path="/tournament/edit/:id"
        component={EditTournament}
      ></Route>
      <Route
        exact
        path="/tournament/players/:tid"
        component={TournamentPlayers}
      ></Route>
      <Route
        exact
        path="/tournament/search"
        component={TournamentSearch}
      ></Route>
      <Route exact path="/tournament/find" component={TournamentFind}></Route>
      <Route
        exact
        path="/tournament/manage-team/:tournamentId/:teamId"
        component={TournamentTeamPlayers}
      ></Route>

      <Route exact path="/team/view/:tid" component={TeamView}></Route>
      <Route exact path="/team/manage/:tid" component={TeamManage}></Route>

      <Route exact path="/account/create" component={AccountCreate}></Route>
      <Route
        exact
        path="/account/recover/:b64?"
        component={AccountRecover}
      ></Route>
      <Route exact path="/account/settings" component={AccountSettings}></Route>

      <Route exact path="/game/lobby" component={GameLobby}></Route>
      <Route exact path="/game/play/:id" component={GamePlay}></Route>
      <Route exact path="/game/view/:id" component={GameView}></Route>

      <Route exact path="/club/manage" component={ClubManage}></Route>
      <Route exact path="/club/view/:cid" component={ClubView}></Route>

      <Route exact path="/organization/manage" component={OrgManage}></Route>
      <Route
        exact
        path="/organization/all-accounts/:oid"
        component={OrgAllAccounts}
      ></Route>
      <Route
        exact
        path="/organization/statistics/:oid"
        component={OrgStatistics}
      ></Route>
      <Route exact path="/organization/view/:oid" component={OrgView}></Route>

      <Route component={NotFound}></Route>
    </Switch>
  );
};

export default Main;
