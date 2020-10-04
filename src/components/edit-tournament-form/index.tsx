import React, {
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { useForm } from "../../context/build-tournament-form";
import Translated from "../Translated";
import { fetchJson } from "../../functions";
import { FormInputs } from "./form-inputs";
import { ShortFormInputs } from "./short-form-inputs";

const kind: Record<string, number> = {
  Knockout: 0,
  SwissDutch: 1,
  TeamKnockout: 2,
  TeamSwissDutch: 3,
  TeamMonrad: 4,
  TeamKonrad: 5,
  TeamOlympiad: 6,
};

const Tiebreaker: Record<string, number> = {
  AverageOpponentRating: 0,
  Buchholz: 1,
  MedianBuchholz: 2,
  MedianBuchholz2: 3,
  BuchholzCut1: 4,
  BuchholzCut2: 5,
};

const EditTournamentForm: FunctionComponent<{}> = () => {
  const form = useForm();

  const [tournamentStarted, setTournamentStarted] = useState(false);

  const getId = () => window.location.pathname.split("/")[3];

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const pairingDateTime = new Date(
      form.firstPairingDate + "T" + form.firstPairingTime
    );
    const pairingDateIsoParts = pairingDateTime.toISOString().split("T");

    const body = {
      id: getId(),
      name: form.name,
      description: form.description,
      kind: form.kind,
      default_game_location: form.defaultGameLocation,
      start_date: form.startDate,
      end_date: form.endDate,
      publicly_viewable: form.publiclyViewable,
      first_pairing_date: pairingDateIsoParts[0],
      first_pairing_time: pairingDateIsoParts[1].substr(0, 5),
      online_pairing_interval_n: form.onlinePairingIntervalN,
      online_pairing_interval_t: form.onlinePairingIntervalT,
      initial_time: form.initialTime,
      increment: form.increment,
      self_joinable: form.selfJoinable,
      show_only_top: form.showOnlyTop,
      show_only_top_nr: form.showOnlyTopNr,
      win_points: form.winPoints,
      draw_points: form.drawPoints,
      loss_points: form.lossPoints,
      tb1: form.tb1 !== "" ? parseInt(form.tb1!, 10) : undefined,
      tb2: form.tb2 !== "" ? parseInt(form.tb2!, 10) : undefined,
      tb3: form.tb3 !== "" ? parseInt(form.tb3!, 10) : undefined,
      tb4: form.tb4 !== "" ? parseInt(form.tb4!, 10) : undefined,
      rounds: form.rounds,
      fide_rated: form.fideRated,
      per_team: form.perTeam,
    };

    fetchJson(`/s/tournament/${getId()}`, "PUT", body, (result) => {
      window.location.assign(`/tournament/view/${getId()}`);
    });
  };

  async function getTournamentData() {
    const result = await fetch(`/s/tournament/view/${getId()}`);
    if (result.status === 200) {
      const data = await result.json();
      const tournament = data.tournament;
      setTournamentStarted(
        (new Date(tournament.first_online_pairing) as any) -
          (new Date() as any) <
          0
      );
      form.changeName(tournament.name);
      form.changeDescription(tournament.description);
      form.changeKind(kind[tournament.kind]);
      form.changeDefaultGameLocation(tournament.default_otb ? 0 : 1);
      form.changeStartDate(tournament.start_date);
      form.changeEndDate(tournament.end_date);
      form.changePubliclyViewable(tournament.publicly_viewable);
      form.changeFirstPairingDate(
        tournament.first_online_pairing.split("T")[0]
      );
      form.changeFirstPairingTime(
        tournament.first_online_pairing.split("T")[1].substring(0, 5)
      );
      form.changeOnlinePairingIntervalN(tournament.online_pairing_interval_n);
      form.changeOnlinePairingIntervalT(tournament.online_pairing_interval_t);
      form.changeInitialTime(tournament.initial_time);
      form.changeIncrement(tournament.increment);
      form.changeSelfJoinable(tournament.self_joinable);
      form.changeFideRated(tournament.fide_rated);
      form.changeShowOnlyTop(!!tournament.show_only_top_nr);
      if (tournament.show_only_top_nr) {
        form.changeShowOnlyTopNr(tournament.show_only_top_nr);
      }
      form.changeWinPoints(tournament.win_points);
      form.changeDrawPoints(tournament.draw_points);
      form.changeLossPoints(tournament.loss_points);
      if (tournament.per_team_limit) {
        form.changePerTeam!(tournament.per_team_limit);
      }
      form.changeTb1(
        tournament.tb1 ? Tiebreaker[tournament.tb1].toString() : ""
      );
      form.changeTb2(
        tournament.tb2 ? Tiebreaker[tournament.tb2].toString() : ""
      );
      form.changeTb3(
        tournament.tb3 ? Tiebreaker[tournament.tb3].toString() : ""
      );
      form.changeTb4(
        tournament.tb4 ? Tiebreaker[tournament.tb4].toString() : ""
      );
      if (tournament.rounds) {
        form.changeRounds!(tournament.rounds);
      }
    }
  }

  useEffect(() => {
    form.changeShow(true);
    getTournamentData();
  }, []);

  return (
    <>
      {form.show && (
        <form className="mt-5" onSubmit={submit}>
          {tournamentStarted ? <ShortFormInputs /> : <FormInputs />}
          <div className="form-group mt-4">
            <button type="submit" className="btn btn-success p-3">
              <strong>
                <Translated str="buildAndInvite" />
              </strong>
            </button>
          </div>
        </form>
      )}
    </>
  );
};
export { EditTournamentForm };