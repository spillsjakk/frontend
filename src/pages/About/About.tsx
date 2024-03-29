import React, { PureComponent } from "react";
import { Helmet } from "react-helmet";
import Translated from "../../components/translated";
import { title } from "../../functions";
import LangContext from "../../components/LangContext";
import "./style.css";
import { Link } from "react-router-dom";

class About extends PureComponent {
  static contextType = LangContext;
  context!: React.ContextType<typeof LangContext>;

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "About";
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("about")}</title>
        </Helmet>
        <h1 className="mt-4 p-3">
          <Translated str="about" />
          &nbsp;
          <Translated str="productName" />
        </h1>
        {this.context.lang === "EN" ? (
          <>
            <p className="mt-4">
              SpillSjakk is a unique platform, designed to help chess clubs and
              organisations with their tournament management and administration,
              from one central place.
            </p>

            <p>
              SpillSjakk offers pairing software supporting multiple formats for
              both teams and individuals, plus all the extras needed to help
              manage your tournament or event. Play is supported either online
              or over-the-board, with an integrated online chess server enabling
              online play of pairings.
            </p>

            <p>
              A breath of fresh air for chess club and chess organisation
              management, SpillSjakk also provides the people running chess
              clubs and organisations with individualised statistics dashboards,
              enabling a new level of insight and trend-spotting into chess
              events.
            </p>

            <p>
              <strong>Main Features</strong>
            </p>
            <ul>
              <li>
                Choose from Swiss (team, individual), Knockout (team,
                individual), Konrad (team), or Skolesjakken (team) pairing
                formats
              </li>
              <li>
                Customise your tournament, choosing time controls, round start
                times and dates, point structures, and whether it is publicly
                joinable or a closed invitational event
              </li>
              <li>
                Generate the print-outs required to run a tournament - pairing
                lists, results lists, boardcards, and a TRF at the end of your
                event
              </li>
              <li>
                Create online accounts for your club members to use, linked to
                their FIDE profile (player account on SpillSjakk not necessary
                for over-the-board events)
              </li>
              <li>
                Monitor the growth and activity of the players in your club, or
                as an organisation oversee your online operation
              </li>
              <li>
                Supports use from a PC, laptop, tablet or mobile phone, using
                any OS. As a webapp, only the browser you use matters (for best
                results, we recommend using the latest version of Chrome or
                Firefox)
              </li>
              <li>
                For games played on SpillSjakk, estimates the change to FIDE
                rating of the player, with a user profile showing their game and
                rating history. Resets every month when the new grading lists
                are confirmed
              </li>
            </ul>
            <p>
              Just as online chess servers modernised and streamlined chess
              online, SpillSjakk aims to make the running of chess tournaments,
              clubs and organisations easier for everyone.
            </p>
            <p>
              SpillSjakk is currently undergoing an invitational round of
              testing and enhancement. For more information about SpillSjakk,
              and using it for your tournament, club or organisation, contact{" "}
              <Link to="mailto:hei@spillsjakk.no">hei@spillsjakk.no</Link>
            </p>
            <p>
              <strong>Terms of purchase:</strong>
            </p>
            <p>
              When registering for a tournament with a participation fee, an
              advance payment of the tournament fee is required.
            </p>
            <p>The following purchase terms apply to the payment:</p>
            <ul>
              <li>The Cancellation Act does not apply, cf. § 22 letter.</li>
            </ul>
            <p>
              The prepaid starting fee is refundable only in the following
              cases:
            </p>
            <ul>
              <li>Federation / club / organizer cancels the tournament</li>
              <li>
                If a tournament participant cancels the registration before the
                registration deadline expires, the organizer will refund the
                paid tournament fee. After the registration deadline has
                expired, the tournament participant is not entitled to a refund
                of the tournament fee.
              </li>
            </ul>
            <p>
              <div>Turneringsplattform AS</div>
              <div>Organization number: 827 073 032</div>
              <div>Sandakerveien 24 C, 0473 Oslo</div>
              <div>Phone: 22151241</div>
              <div>Email: hei@spillsjakk.no</div>
            </p>
          </>
        ) : (
          <>
            <p className="mt-4">
              SpillSjakk er en unik plattform, laget for å hjelpe sjakklubber og
              andre organisasjoner med turneringsoppsett og administrasjon. Alt
              fra ett sted!
            </p>
            <p>
              SpillSjakk støtter oppsett av både lag- og individuelle
              turneringer, online eller over brettet. Her finnes alle tilleggene
              som trengs for å administrere turneringen eller arrangementet
              ditt. Integrert i SpillSjakk er en sjakkserver som muliggjør
              online spill og oppsett.
            </p>
            <p>
              SpillSjakk er et friskt pust for sjakklubben og
              sjakkorganisasjonen. Individualiserte statistikkpanel muliggjør et
              nytt nivå av innsikt og trendspotting i sjakkarrangement.
            </p>
            <p>
              <strong>Hovedfunksjoner</strong>
            </p>
            <ul>
              <li>
                Velg mellom turneringsformatene Swiss (lag, individuell),
                Knockout (lag, individuell), Konrad (lag), eller Skolesjakken
                (lag).
              </li>
              <li>
                Opprett turneringen og velg tidskontroll, rundestart og dato,
                poengsystem, og om den skal være offentlig synlig eller
                tilgjengelig kun for inviterte.
              </li>
              <li>
                Lag utskrifter av rundeoppsett, resultatlister, bordkort, and og
                turneringsrapport etter at turneringen er ferdigspilt.
              </li>
              <li>
                Opprett online-kontoer som medlemmene kan benytte, gjerne
                tilknyttet deres FIDE profil. (Spillerkonto på SpillSjakk er
                ikke nødvendig for turneringer som spilles over brett.)
              </li>
              <li>
                Overvåk endringer og aktiviteten til spillerne i din klubb,
                eller få overblikk som organisator online.
              </li>
              <li>
                Støtter alle operativsystem med bruk fra pc, laptop, nettbrett
                eller mobil. Som webapplikasjon er det kun valget av nettleser
                som har betydning. For beste resultat anbefaler vi Chrome eller
                Firefox.
              </li>
              <li>
                For partier som spilles på serveren, estimeres endringer ut i
                fra FIDE-ratingen til spilleren. Brukerprofilen viser partiene
                og ratingen, som nullstilles hver måned når de nye ratinglistene
                er bekreftet.
              </li>
            </ul>
            <p>
              Akkurat som sjakkservere har modernisert og effektivisert spill
              over nett, har SpillSjakk som mål å forenkle drift av
              sjakkturneringer, klubber og organisasjoner for alle.
            </p>
            <p>
              SpillSjakk gjennomgår for tiden en lukket invitasjonsrunde for
              testing og forbedring. Kontakt{" "}
              <Link to="mailto:hei@spillsjakk.no">hei@spillsjakk.no</Link> for
              mer informasjon om SpillSjakk og bruk av den til din turnering,
              klubb eller organisasjon.
            </p>
            <p>
              <strong>Kjøpsvilkår:</strong>
            </p>
            <p>
              Ved påmelding til turnering med deltakeravgift er det påkrevd med
              forhåndsbetaling av turneringsavgift.
            </p>
            <p>Følgende kjøpsvilkår gjelder for betalingen:</p>
            <ul>
              <li>
                Angrerettloven kommer ikke til anvendelse, jf. angrerettloven §
                22 bokstav m.
              </li>
            </ul>
            <p>
              Den forhåndsbetalte startkontingenten refunderes kun i følgende
              tilfeller:
            </p>
            <ul>
              <li>Forbund/klubb/arrangør avlyser eller avbryter turneringen</li>
              <li>
                Om turneringsdeltakeren melder seg av turneringen innen
                påmeldingsfristen utløper, vil arrangør refundere innbetalt
                turneringsavgift. Etter at påmeldingsfristen har utløpt har
                turneringsdeltakeren ikke rett til refusjon av turneringsavgift.
              </li>
            </ul>
            <p>
              <div>Turneringsplattform AS</div>
              <div>Orgnr: 827 073 032</div>
              <div>Sandakerveien 24 C, 0473 Oslo</div>
              <div>Tlf: 22151241</div>
              <div>Epost: hei@spillsjakk.no</div>
            </p>
          </>
        )}
      </>
    );
  }
}

export default About;
