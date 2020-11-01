import React, { PureComponent } from "react";

import LangContext from "./LangContext";

type TranslatedProps = {
  str: string;
};

class Translated extends PureComponent<TranslatedProps, {}> {
  static contextType = LangContext;
  context!: React.ContextType<typeof LangContext>;

  private static getStr(key: string, lang: string) {
    if (key in (STRINGS as any)[lang]) {
      return (STRINGS as any)[lang][key];
    } else if (key in STRINGS.EN) {
      return (STRINGS as any).EN[key];
    } else {
      return key;
    }
  }

  static byKey(key: string) {
    const lang = localStorage.getItem("lang") ?? "EN";
    return Translated.getStr(key, lang);
  }

  render() {
    const str = this.props.str;
    const lang = this.context.lang;
    return Translated.getStr(str, lang);
  }
}

const STRINGS = {
  EN: {
    login: "Log in",
    logout: "Log out",
    productName: "SpillSjakk",
    home: "Home",
    username: "Username",
    password: "Password",
    invalidCredentials: "Invalid username or password.",
    contact: "Contact",
    about: "About",
    productDescription:
      "Fast, simple, and reliable chess tournament administration and pairings.",
    buildTournament: "Build a tournament",
    editTournament: "Edit the tournament details",
    findTournament: "Find a tournament",
    tournamentName: "Tournament name",
    description: "Description",
    profile_picture: "Profile Picture",
    type: "Type",
    knockout: "Knockout",
    swissDutch: "Swiss (Dutch)",
    teamKnockout: "Team Knockout",
    teamSwissDutch: "Team Swiss (Dutch)",
    teamOlympiad: "Team Olympiad",
    BETA: "BETA",
    roundNb: "Number of rounds",
    defaultGameLocation: "Default game location",
    otb: "Over the board",
    online: "Online",
    gameLocationCanBeChanged:
      "Game location can be changed for each pairing when the tournament is running.",
    buildAndInvite: "Build and invite players",
    startDate: "Start date",
    endDate: "End date",
    publiclyViewable: "Publicly viewable",
    rounds: "rounds",
    player: "Player",
    score: "Score",
    standings: "Standings",
    start: "Start",
    seed: "Seed",
    createAccounts: "Create accounts",
    fullName: "Full name",
    fideNumber: "FIDE number",
    fideRating: "FIDE rating",
    title: "Title",
    fideFederation: "FIDE federation",
    birthDate: "Birth date",
    sex: "Sex",
    add: "Add",
    passwords: "Passwords",
    thisIsTheOnlyTimeYouSeeThesePasswords:
      "See usernames and passwords for newly created accounts here. This is the only time you see these passwords!",
    participants: "Participants",
    manageParticipants: "Manage participants",
    addParticipantsWithAccount: "Add participants with account",
    addParticipantsWithoutAccount: "Add participants without account",
    id: "ID",
    backToTournament: "Back to tournament",
    byRating: "By rating",
    random: "Random",
    update: "Update",
    seeding: "Seeding",
    pairings: "Pairings",
    round: "Round",
    teams: "Teams",
    name: "Name",
    addATeam: "Add a team",
    manageTeamPlayers: "Manage team players",
    participating: "Participating",
    notParticipating: "Not participating",
    remove: "Remove",
    team: "Team",
    matchScore: "Match score",
    gameScore: "Game score",
    board: "Board",
    membersPerTeam: "Members per team",
    firstPairingDateTime: "First online pairing date and time",
    ifNoOnlineGames: "If pairing is OTB, enter any date and time",
    onlinePairingInterval: "Interval between online games",
    minutes: "minutes",
    hours: "hours",
    days: "days",
    weeks: "weeks",
    timeControl: "Time control",
    permissions: "Permissions",
    participant: "Participant",
    teamManager: "Team manager",
    tournamentOrganizer: "Tournament organizer",
    federation: "Federation",
    manage: "Manage",
    findTournaments: "Find tournaments",
    ongoingTournaments: "Ongoing tournaments",
    upcomingTournaments: "Upcoming tournaments",
    idAlreadyTaken: "This ID is already taken.",
    theUrlForThisTournament:
      "The URL for this tournament will be /tournament/view/<id>",
    createATeam: "Create a team",
    theUrlForThisTeam: "The URL for this team will be /team/view/<id>",
    create: "Create",
    playersPerTeam: "players per team",
    whiteWon: "white won",
    blackWon: "black won",
    draw: "the game was a draw",
    reviewGame: "Review Game",
    nextGame: "Next Game",
    members: "Members",
    suggestedAccounts: "Suggested accounts",
    addOtherAccount: "Add other account",
    accountDoesNotExist: "That account does not exist.",
    alreadyMemberOfTeam: "That account is alredy a member of this team.",
    myTeams: "My teams",
    teamMonrad: "Team SkoleSjakken",
    play: "Play",
    spectate: "Spectate",
    waitingForGame: "Waiting for the next game",
    nextGameIn: "Your next game starts in:",
    noUpcomingGames: "There are no upcoming games for you at the moment.",
    nextOnlinePairingWillBeAt: "The next online pairing will be at",
    changeNextPairingDateTime: "Change the time of the next pairing:",
    resign: "Resign",
    offerDraw: "Offer draw",
    acceptDraw: "Accept draw?",
    yes: "Yes",
    no: "No",
    drawOfferPending: "Draw offer pending...",
    whiteWins: "White wins, 1-0.",
    blackWins: "Black wins, 0-1.",
    itsADraw: "It's a draw, 1/2-1/2.",
    aboutToPlay: "You are about to start playing a game!",
    goToLobby: "Go to the lobby.",
    finished: "Finished",
    ongoing: "Ongoing",
    tournaments: "Tournaments",
    tournament: "Tournament",
    games: "Games",
    game: "Game",
    dateTime: "Date/time",
    result: "Result",
    viewGame: "View game",
    rawPgn: "Raw PGN",
    teamKonrad: "Team Konrad",
    manualPairing: "Manual Pairing",
    firstName: "First name",
    lastName: "Last name",
    downloadAsCsv: "Download as CSV",
    join: "Join",
    joinFor: "Join for",
    allowSelfJoining: "Allow self-joining",
    leave: "Leave",
    searchTournaments: "Search tournaments",
    searchEllipsis: "Search...",
    seconds: "seconds",
    carousel1: "Manage teams and players",
    carousel1Desc:
      "Create your roster of players, from regulars in a weekly season long league, to a major national open. Auto-fill from FIDE’s database and create accounts for online entrants to use.",
    carousel2: "Build a tournament",
    carousel2Desc:
      "Multiple tournament formats supported, including Swiss (Dutch). Choose from popular templates, or build and save something unique with full customisation.",
    carousel3: "Play online or OTB",
    carousel3Desc:
      "Tournament organisers can plan, build, and customise events with full OTB support. Online functionality allows participants to get paired and play all in one place.",
    carousel4: "Results tracking",
    carousel4Desc:
      "Online results automatically updated, manual overrides let the organiser handle disputes and appeals. Search past, current and future events, and find specific games from players profiles.",
    rating: "Rating",
    weighted: "Weighted",
    pageNotFound: "This page has not been found.",
    manageClub: "Manage club",
    country: "Country",
    region: "Region",
    submit: "Submit",
    addMember: "Add member",
    otherClubMembers: "Other club members",
    forgotPassword: "Forgot password?",
    invalidPasswordRecoveryCode: "The given password recovery code is invalid.",
    passwordRecoveryEmailSent:
      "We sent you an email with a link to recover your password.",
    accountHasNoEmail:
      "There is no email address associated with this account.",
    recoverAccount: "Recover account",
    recover: "Recover",
    newPassword: "New password",
    newPasswordAgain: "New password (again)",
    manageOrganization: "Manage organization",
    addClub: "Add a club",
    clubs: "Clubs",
    accountList: "Account list",
    organizationStatistics: "Organization statistics",
    totalClubCount: "Total club count",
    totalPlayerCount: "Total player count",
    clubCount: "Club count",
    playerCount: "Player count",
    averageAge: "Average age",
    mfRatio: "M/F ratio",
    age: "Age",
    onlyShowScoresOfTop: "Only show scores of individuals and teams in the top",
    winPoints: "Points for a win",
    drawPoints: "Points for a draw",
    lossPoints: "Points for a loss",
    email: "Email",
    "500": "500 - Internal Server Error",
    "404":
      "404 - Resource not found. If it should exist, check that you are logged in.",
    "403":
      "403 - Forbidden. You are not logged in, or don't have the permissions to do this.",
    joinOrganization: "Join organization",
    organizations: "Organizations",
    suggestedOrganizations: "Suggested organizations",
    passwordsAreNotEqual: "The two passwords are not equal.",
    passwordChanged: "Your password has been changed.",
    emailChanged: "Your email address has been changed.",
    currentPassword: "Current password",
    accountSettings: "Account settings",
    changeEmail: "Change email",
    changePassword: "Change password",
    incorrectPassword: "Incorrect password",
    localTime: "local time",
    statistics: "Statistics",
    privateTournament: "This tournament is private.",
    resultPrintouts: "Result printouts",
    pairingPrintouts: "Pairing printouts",
    tiebreaker: "Tiebreaker",
    averageOpponentRating: "Average opponent rating",
    buchholz: "Buccholz",
    medianBuchholz: "Median Buchholz",
    medianBuchholz2: "Median Buchholz 2",
    buchholzCut1: "Buchholz Cut 1",
    buchholzCut2: "Buchholz Cut 2",
    individual: "Individual",
    fideRated: "This is a FIDE rated tournament.",
    provisionalFideRating: "Provisional FIDE rating",
    lobby: "Lobby",
    playGame: "Play game",
    continueWithoutTemplate: "Continue Without Selecting Template",
    startsIn: "Starts in ",
    deleteTournament: "Delete Tournament",
    confirmTournamentDeletion: "Do you delete the tournament?",
    profilePicturePlaceholder: "Please fill in the url of the image",
    boardCards: "Board cards",
    inbox: "Inbox",
    messageMembers: "Message members",
    send: "Send",
    manageRoundsAndPairings: "Manage Rounds And Pairings",
    addRound: "Add Round",
    deleteRound: "Delete Round",
    addPairing: "Add Pairing",
    deletePairing: "Delete Pairing",
    fillDateAndTime: "Fill in the date and time of the round",
    white: "White",
    black: "Black",
    nameOfThePlayer: "name of the player",
    fideOfThePlayer: "FIDE number of the player",
  },
  NO: {
    login: "Logg inn",
    logout: "Logg ut",
    home: "Hjem",
    username: "Brukernavn",
    password: "Passord",
    invalidCredentials: "Feil brukernavn eller passord.",
    contact: "Kontakt",
    about: "Om",
    productDescription: "SpillSjakk: sjakkturneringer over nett og brett!",
    editTournament: "Edit the tournament details",
    findTournament: "Finn turnering",
    tournamentName: "Turneringsnavn",
    description: "Beskrivelse",
    type: "Type",
    knockout: "Knockout",
    BETA: "BETA",
    roundNb: "Antall runder",
    otb: "Over brettet",
    online: "Online",
    startDate: "Startdato",
    endDate: "Sluttdato",
    publiclyViewable: "Synlig for alle",
    rounds: "Runder",
    player: "Spiller",
    score: "Score",
    standings: "Oversikt",
    start: "Start",
    seed: "Seed",
    createAccounts: "Opprett kontoer",
    fullName: "Fullt navn",
    fideNumber: "FIDE nummer",
    fideRating: "FIDE rating",
    title: "Tittel",
    fideFederation: "Verdens Sjakkforbund",
    birthDate: "Fødselsdato",
    sex: "Kjønn",
    add: "Legg til",
    passwords: "Passord",
    thisIsTheOnlyTimeYouSeeThesePasswords:
      "Se passordet for den nye kontoen her. Du ser passordet bare nå!",
    participants: "Deltakere",
    manageParticipants: "Organiser deltakere",
    addParticipantsWithAccount: "Legg til deltakere med konto",
    id: "ID",
    backToTournament: "Tilbake til turneringa",
    byRating: "Etter rating",
    random: "Tilfeldig",
    update: "Oppdater",
    round: "Runde",
    teams: "Lag",
    name: "Navn",
    addATeam: "Legg til et lag",
    manageTeamPlayers: "organiser spillere i laget",
    participating: "deltakende",
    notParticipating: "deltar ikke",
    remove: "fjerne",
    team: "lag",
    matchScore: "kampresultat",
    gameScore: "partiresultat",
    board: "brett",
    membersPerTeam: "antall spillere per lag",
    firstPairingDateTime: "tidspunkt og dato for første rundeoppsett",
    ifNoOnlineGames: "hvis ingen av partiene spilles online",
    onlinePairingInterval: "intervall mellom rundeoppsett online",
    minutes: "Minutter",
    hours: "timer",
    days: "dager",
    weeks: "uker",
    timeControl: "tidskontroll",
    permissions: "tillatelser",
    participant: "deltaker",
    teamManager: "lagleder",
    tournamentOrganizer: "turneringsleder",
    federation: "forbund",
    manage: "administrere",
    findTournaments: "finn turneringer",
    ongoingTournaments: "pågående turneringer",
    upcomingTournaments: "kommende turneringer",
    idAlreadyTaken: "brukernavn opptatt",
    theUrlForThisTournament: "URL for denne turneringa",
    createATeam: "opprett et lag",
    theUrlForThisTeam: "URL for dette laget",
    create: "opprett",
    playersPerTeam: "antall spillere per lag",
    whiteWon: "white won",
    blackWon: "black won",
    draw: "the game was a draw",
    reviewGame: "Review Game",
    nextGame: "Next Game",
    suggestedAccounts: "foreslåtte kontoer",
    addOtherAccount: "legg til en konto",
    accountDoesNotExist: "kontoen eksisterer ikke",
    alreadyMemberOfTeam: "allerede medlem av et lag",
    myTeams: "mine lag",
    carousel1: "Administrer spillere og lag",
    carousel1Desc:
      "Opprett egne lag og legg til spillere gjennom administrativ kontotilgang.",
    carousel2: "Opprett turnering",
    carousel2Desc:
      "Velg turneringsformat og bruk populære maler eller gjør manuell utforming av detaljer.",
    carousel3: "Spill online eller over brett",
    carousel3Desc:
      "Turneringer kan spilles online eller over brett, med full fleksibilitet for endring underveis.",
    carousel4: "Velg offentliggjøring",
    carousel4Desc:
      "Turneringsledere velger om resultater skal offentliggjøres eller ikke.",
    continueWithoutTemplate: "Fortsett uten å velge en mal",
    deleteTournament: "Delete Tournament",
    confirmTournamentDeletion: "Do you delete the tournament?",
    profilePicturePlaceholder: "Please fill in the url of the image",
    manageOrganization: "Opprett/administrer organisasjon",
    profile_picture: "Profilbilde",
    country: "Land",
    submit: "Send inn",
    accountList: "Kontoliste",
    statistics: "Statistikk",
    addClub: "Legg til en Klubb",
    clubs: "Klubber",
    inbox: "Innboks",
    seconds: "Sekunder",
    individual: "Individuell",
    allowSelfJoining: "Tillat egenpåmelding",
    fideRated: "Dette er en FIDE-ratet turnering",
    onlyShowScoresOfTop: "Antall spillere eller lag som skal vises med resultat på listene",
    gameLocationCanBeChanged: "Om det skal spilles online eller over brett kan endres for hver runde",
    winPoints: "Poeng for seier",
    drawPoints: "Poeng for remis",
    lossPoints: "Poeng for tap",
    buildAndInvite: "Opprett turnering og inviter spillere",
    firstName: "Fornavn",
    lastName: "Etternavn",
    downloadAsCsv: "Last ned som CSV",
    manageClub: "Opprett/administrer klubb",
    buildTournament: "Opprett turnering",
    organizations: "Organisasjoner",
    members: "Medlemmer",
    startsIn: "Starter om",
    nextOnlinePairingWillBeAt: "Oppsett av neste runde skjer",
    pairings: "Rundeoppsett",
    resign: "Gi opp",
    offerDraw: "Tilby remis",
    yes: "Ja",
    no: "Nei",
    manageRoundsAndPairings: "",
    addRound: "",
    deleteRound: "",
    addPairing: "",
    deletePairing: "",
    fillDateAndTime: "",
    white: "",
    black: "",
    nameOfThePlayer: "",
    fideOfThePlayer: "",
    manualPairing: "",
  },
};

export default Translated;
