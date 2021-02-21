import React from "react";
import { Switch, Route } from "react-router-dom";

import About from "./pages/About/About";
import { UserGuide } from "./pages/user-guide/index";
import { Contact } from "./pages/contact/index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import TournamentManage from "./pages/Tournament/Manage";
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
import GamePlay from "./pages/Game/play";
import GameView from "./pages/Game/View";
import { OnboardInvitation } from "./pages/registration/onboard-invitation";
import { GenerateInvitation } from "./pages/registration/generate-invitation";
import { CreateOrganization } from "./pages/registration/organization";
import { ManageClubPage } from "./pages/Club/manage/index";
import { ClubView } from "./pages/Club/view/index";
import { ManageOrganizationPage } from "./pages/Organization/manage/index";
import OrgView from "./pages/Organization/View";
import { BuildTournament } from "./pages/Tournament/build/index";
import { EditTournament } from "./pages/Tournament/edit/index";
import { Home } from "./pages/Home/index";
import { Inbox } from "./pages/inbox/index";
import { OrganizationsAndClubs } from "./pages/organizations-and-clubs/index";
import { TournamentDetail } from "./pages/Tournament/detail";
import { UserAgreement } from "./pages/contracts/user-agreement";
import { PrivacyNotice } from "./pages/contracts/privacy-notice";
import { Lobby } from "./pages/lobby/index";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/about" component={About}></Route>
      <Route exact path="/user-guide" component={UserGuide}></Route>
      <Route exact path="/contact" component={Contact}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/inbox" component={Inbox}></Route>
      <Route exact path="/browse" component={OrganizationsAndClubs}></Route>

      <Route exact path="/profile/:uid" component={Profile}></Route>

      <Route
        exact
        path="/tournament/manage/:tid"
        component={TournamentManage}
      ></Route>
      <Route
        exact
        path="/tournament/view/:tid"
        component={TournamentDetail}
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

      <Route exact path="/calendar" component={Lobby}></Route>
      <Route exact path="/game/lobby" component={GameLobby}></Route>
      <Route exact path="/game/play/:id" component={GamePlay}></Route>
      <Route exact path="/game/view/:id" component={GameView}></Route>

      <Route exact path="/club/manage" component={ManageClubPage}></Route>
      <Route exact path="/club/view/:cid" component={ClubView}></Route>

      <Route
        exact
        path="/organization/manage"
        component={ManageOrganizationPage}
      ></Route>
      <Route exact path="/organization/view/:oid" component={OrgView}></Route>
      <Route exact path="/invitation/:id" component={OnboardInvitation}></Route>
      <Route
        exact
        path="/registration/generate/invitation"
        component={GenerateInvitation}
      ></Route>
      <Route
        exact
        path="/registration/organization"
        component={CreateOrganization}
      ></Route>
      <Route exact path="/user-agreement" component={UserAgreement}></Route>
      <Route exact path="/privacy-notice" component={PrivacyNotice}></Route>
      <Route component={NotFound}></Route>
    </Switch>
  );
};

export default Main;
