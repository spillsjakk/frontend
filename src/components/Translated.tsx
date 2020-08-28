import React, { PureComponent } from "react";
import ReactDOMServer from "react-dom/server";

import LangContext from './LangContext';

type TranslatedProps = {
  str: string
}

class Translated extends PureComponent<TranslatedProps, {}> {
  static contextType = LangContext;
  context!: React.ContextType<typeof LangContext>;

  static byKey(key: string) {
    return <Translated str={key} />;
  }

  render() {
    let str = this.props.str;
    let lang = this.context.lang;
    if (str in (STRINGS as any)[lang]) {
      return (STRINGS as any)[lang][str];
    } else if (str in STRINGS.EN) {
      return (STRINGS as any).EN[str];
    } else {
      return str;
    }
  }
}

const STRINGS = {
  "EN": {
    "login": "Log in",
    "logout": "Log out",
    "productName": "SpillSjakk",
    "home": "Home",
    "username": "Username",
    "password": "Password",
    "invalidCredentials": "Invalid username or password.",
    "contact": "Contact",
    "about": "About",
    "productDescription": "Fast, simple, and reliable chess tournament administration and pairings.",
    "buildTournament": "Build a tournament",
    "findTournament": "Find a tournament",
    "tournamentName": "Tournament name",
    "description": "Description",
    "type": "Type",
    "knockout": "Knockout",
    "swissDutch": "Swiss (Dutch)",
    "teamKnockout": "Team Knockout",
    "teamSwissDutch": "Team Swiss (Dutch)",
    "teamOlympiad": "Team Olympiad",
    "BETA": "BETA",
    "roundNb": "Number of rounds",
    "defaultGameLocation": "Default game location",
    "otb": "Over the board",
    "online": "Online",
    "gameLocationCanBeChanged": "Game location can be changed for each pairing when the tournament is running.",
    "buildAndInvite": "Build and invite players",
    "startDate": "Start date",
    "endDate": "End date",
    "publiclyViewable": "Publicly viewable",
    "rounds": "rounds",
    "player": "Player",
    "score": "Score",
    "standings": "Standings",
    "start": "Start",
    "seed": "Seed",
    "createAccounts": "Create accounts",
    "fullName": "Full name",
    "fideNumber": "FIDE number",
    "fideRating": "FIDE rating",
    "title": "Title",
    "fideFederation": "FIDE federation",
    "birthDate": "Birth date",
    "sex": "Sex",
    "add": "Add",
    "passwords": "Passwords",
    "thisIsTheOnlyTimeYouSeeThesePasswords": "See usernames and passwords for newly created accounts here. This is the only time you see these passwords!",
    "participants": "Participants",
    "manageParticipants": "Manage participants",
    "addParticipantsWithAccount": "Add participants with account",
    "addParticipantsWithoutAccount": "Add participants without account",
    "id": "ID",
    "backToTournament": "Back to tournament",
    "byRating": "By rating",
    "random": "Random",
    "update": "Update",
    "seeding": "Seeding",
    "pairings": "Pairings",
    "round": "Round",
    "teams": "Teams",
    "name": "Name",
    "addATeam": "Add a team",
    "manageTeamPlayers": "Manage team players",
    "participating": "Participating",
    "notParticipating": "Not participating",
    "remove": "Remove",
    "team": "Team",
    "matchScore": "Match score",
    "gameScore": "Game score",
    "board": "Board",
    "membersPerTeam": "Members per team",
    "firstPairingDateTime": "First online pairing date/time",
    "ifNoOnlineGames": "If no games will be played online, fill in anything here, does not watter what.",
    "onlinePairingInterval": "Interval between online games",
    "minutes": "minutes",
    "hours": "hours",
    "days": "days",
    "weeks": "weeks",
    "timeControl": "Time control",
    "permissions": "Permissions",
    "participant": "Participant",
    "teamManager": "Team manager",
    "tournamentOrganizer": "Tournament organizer",
    "federation": "Federation",
    "manage": "Manage",
    "findTournaments": "Find tournaments",
    "ongoingTournaments": "Ongoing tournaments",
    "upcomingTournaments": "Upcoming tournaments",
    "idAlreadyTaken": "This ID is already taken.",
    "theUrlForThisTournament": "The URL for this tournament will be /tournament/view/<id>",
    "createATeam": "Create a team",
    "theUrlForThisTeam": "The URL for this team will be /team/view/<id>",
    "create": "Create",
    "playersPerTeam": "players per team",
    "members": "Members",
    "suggestedAccounts": "Suggested accounts",
    "addOtherAccount": "Add other account",
    "accountDoesNotExist": "That account does not exist.",
    "alreadyMemberOfTeam": "That account is alredy a member of this team.",
    "myTeams": "My teams",
    "teamMonrad": "Team SkoleSjakken",
    "play": "Play",
    "spectate": "Spectate",
    "waitingForGame": "Waiting for the next game",
    "nextGameIn": "Your next game starts in:",
    "noUpcomingGames": "There are no upcoming games for you at the moment.",
    "nextOnlinePairingWillBeAt": "The next online pairing will be at",
    "changeNextPairingDateTime": "Change the time of the next pairing:",
    "resign": "Resign",
    "offerDraw": "Offer draw",
    "acceptDraw": "Accept draw?",
    "yes": "Yes",
    "no": "No",
    "drawOfferPending": "Draw offer pending...",
    "whiteWins": "White wins, 1-0.",
    "blackWins": "Black wins, 0-1.",
    "itsADraw": "It's a draw, 1/2-1/2.",
    "aboutToPlay": "You are about to start playing a game!",
    "goToLobby": "Go to the lobby.",
    "finished": "Finished",
    "ongoing": "Ongoing",
    "tournaments": "Tournaments",
    "tournament": "Tournament",
    "games": "Games",
    "game": "Game",
    "dateTime": "Date/time",
    "result": "Result",
    "viewGame": "View game",
    "rawPgn": "Raw PGN",
    "teamKonrad": "Team Konrad",
    "firstName": "First name",
    "lastName": "Last name",
    "downloadAsCsv": "Download as CSV",
    "join": "Join",
    "joinFor": "Join for",
    "allowSelfJoining": "Allow self-joining",
    "leave": "Leave",
    "searchTournaments": "Search tournaments",
    "searchEllipsis": "Search...",
    "seconds": "seconds",
    "carousel1": "Manage teams and players",
    "carousel1Desc": "Create your roster of players, from regulars in a weekly season long league, to a major national open. Auto-fill from FIDE’s database and create accounts for online entrants to use.",
    "carousel2": "Build a tournament",
    "carousel2Desc": "Multiple tournament formats supported, including Swiss (Dutch). Choose from popular templates, or build and save something unique with full customisation.",
    "carousel3": "Play online or OTB",
    "carousel3Desc": "Tournament organisers can plan, build, and customise events with full OTB support. Online functionality allows participants to get paired and play all in one place.",
    "carousel4": "Results tracking",
    "carousel4Desc": "Online results automatically updated, manual overrides let the organiser handle disputes and appeals. Search past, current and future events, and find specific games from players profiles.",
    "rating": "Rating",
    "weighted": "Weighted",
    "pageNotFound": "This page has not been found.",
    "manageClub": "Manage club",
    "country": "Country",
    "region": "Region",
    "submit": "Submit",
    "addMember": "Add member",
    "otherClubMembers": "Other club members"
  },
  "NO": {
    "login": "Logg inn",
    "logout": "Logg ut",
    "home": "Hjem",
    "username": "Brukernavn",
    "password": "Passord",
    "invalidCredentials": "Feil brukernavn eller passord.",
    "contact": "Kontakt",
    "about": "Om",
    "productDescription": "SpillSjakk: sjakkturneringer over nett og brett!",
    "buildTournament": "Lag turnering",
    "findTournament": "Finn turnering",
    "tournamentName": "Turneringsnavn",
    "description": "Beskrivelse",
    "type": "Type",
    "knockout": "Knockout",
    "BETA": "BETA",
    "roundNb": "Antall runder",
    "otb": "Over brettet",
    "online": "Online",
    "startDate": "Startdato",
    "endDate": "Sluttdato",
    "publiclyViewable": "Synlig for alle",
    "rounds": "Runder",
    "player": "Spiller",
    "score": "Score",
    "standings": "Standings",
    "start": "Start",
    "seed": "Seed",
    "createAccounts": "Opprett en konto (kontoer)",
    "fullName": "Fullt navn",
    "fideNumber": "FIDE nummer",
    "fideRating": "FIDE rating",
    "title": "Tittel",
    "fideFederation": "Verdens Sjakkforbund",
    "birthDate": "Fødselsdato",
    "sex": "Kjønn",
    "add": "Legg til",
    "passwords": "Passord",
    "thisIsTheOnlyTimeYouSeeThesePasswords": "Se passordet for den nye kontoen her. Du ser passordet bare nå!",
    "participants": "Deltakere",
    "manageParticipants": "Organiser deltakere",
    "addParticipantsWithAccount": "Legg til deltakere med konto",
    "id": "ID",
    "backToTournament": "Tilbake til turneringa",
    "byRating": "Etter rating",
    "random": "Tilfeldig",
    "update": "Oppdater",
    "round": "Runde",
    "teams": "Lag",
    "name": "Navn",
    "addATeam": "Legg til et lag",
    "manageTeamPlayers": "organiser spillere i laget",
    "participating": "deltakende",
    "notParticipating": "deltar ikke",
    "remove": "fjerne",
    "team": "lag",
    "matchScore": "kampresultat",
    "gameScore": "partiresultat",
    "board": "brett",
    "membersPerTeam": "antall spillere per lag",
    "firstPairingDateTime": "tidspunkt og dato for første rundeoppsett",
    "ifNoOnlineGames": "hvis ingen av partiene spilles online",
    "onlinePairingInterval": "intervall mellom rundeoppsett online",
    "minutes": "minutter",
    "hours": "timer",
    "days": "dager",
    "weeks": "uker",
    "timeControl": "tidskontroll",
    "permissions": "tillatelser",
    "participant": "deltaker",
    "teamManager": "lagleder",
    "tournamentOrganizer": "turneringsleder",
    "federation": "forbund",
    "manage": "administrere",
    "findTournaments": "finn turneringer",
    "ongoingTournaments": "pågående turneringer",
    "upcomingTournaments": "kommende turneringer",
    "idAlreadyTaken": "brukernavn opptatt",
    "theUrlForThisTournament": "URL for denne turneringa",
    "createATeam": "opprett et lag",
    "theUrlForThisTeam": "URL for dette laget",
    "create": "opprett",
    "playersPerTeam": "antall spillere per lag",
    "members": "medlemmer",
    "suggestedAccounts": "foreslåtte kontoer",
    "addOtherAccount": "legg til en konto",
    "accountDoesNotExist": "kontoen eksisterer ikke",
    "alreadyMemberOfTeam": "allerede medlem av et lag",
    "myTeams": "mine lag",
    "carousel1": "Administrer spillere og lag",
    "carousel1Desc": "Opprett egne lag og legg til spillere gjennom administrativ kontotilgang.",
    "carousel2": "Opprett turnering",
    "carousel2Desc": "Velg turneringsformat og bruk populære maler eller gjør manuell utforming av detaljer.",
    "carousel3": "Spill online eller over brett",
    "carousel3Desc": "Turneringer kan spilles online eller over brett, med full fleksibilitet for endring underveis.",
    "carousel4": "Velg offentliggjøring",
    "carousel4Desc": "Turneringsledere velger om resultater skal offentliggjøres eller ikke.",
  }
};

export default Translated;