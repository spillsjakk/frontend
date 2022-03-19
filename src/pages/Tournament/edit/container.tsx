import React, {
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { useForm } from "../../../hocs/tournament-form";
import Translated from "../../../components/translated";
import { fetchJson, title } from "../../../functions";
import { FormInputs } from "./form-inputs";
import { ShortFormInputs } from "./short-form-inputs";
import { useTournamentRound } from "../../../context/tournament-round";
import { useTournament } from "../../../context/tournament";
import { KIND, TIEBREAKER } from "../../../constants";
import { Helmet } from "react-helmet";

const EditTournamentForm: FunctionComponent<{}> = () => {
  const form = useForm();

  const [tournamentStarted, setTournamentStarted] = useState(false);

  const { rounds } = useTournamentRound();

  const { tournament } = useTournament();

  const getId = () => window.location.pathname.split("/")[3];

  useEffect(() => {
    if (Array.isArray(rounds) && rounds.length > 0) {
      setTournamentStarted(true);
    }
  }, [rounds]);

  useEffect(() => {
    if (tournament && tournament.id) {
      form.changeShow(true);
      setFormStates();
      const startDate = new Date(tournament.first_online_pairing);
      if (new Date().getTime() - startDate.getTime() > 0) {
        setTournamentStarted(true);
      }
    }
  }, [tournament]);

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
      show_only_usernames: form.showOnlyUsernames,
      profile_picture: form.profilePicture,
      banner_picture: form.bannerPicture,
      chat_enabled: form.chatEnabled,
      remove_inactive_participants: form.removeInactive,
    };

    fetchJson(`/s/tournament/${getId()}`, "PUT", body, (result) => {
      window.location.assign(`/tournament/view/${getId()}`);
    });
  };

  function setFormStates() {
    if (tournament && tournament.id) {
      form.changeName(tournament.name);
      form.changeDescription(tournament.description);
      form.changeKind((KIND as any)[tournament.kind]);
      form.changeDefaultGameLocation(tournament.default_otb ? 0 : 1);
      form.changeStartDate(tournament.start_date);
      form.changeEndDate(tournament.end_date);
      form.changePubliclyViewable(tournament.publicly_viewable);
      const firstOnlinePairingDate = new Date(tournament.first_online_pairing);
      form.changeFirstPairingDate(
        firstOnlinePairingDate.toISOString().split("T")[0]
      );
      form.changeFirstPairingTime(
        firstOnlinePairingDate.toTimeString().substring(0, 5)
      );
      form.changeOnlinePairingIntervalN(tournament.online_pairing_interval_n);
      form.changeOnlinePairingIntervalT(tournament.online_pairing_interval_t);
      form.changeInitialTime(tournament.initial_time);
      form.changeIncrement(tournament.increment);
      form.changeSelfJoinable(tournament.self_joinable);
      form.changeFideRated(tournament.fide_rated);
      form.changeShowOnlyTop(
        typeof tournament.show_only_top_nr !== "undefined" &&
          tournament.show_only_top_nr !== null
      );
      if (
        typeof tournament.show_only_top_nr !== "undefined" &&
        tournament.show_only_top_nr !== null
      ) {
        form.changeShowOnlyTopNr(tournament.show_only_top_nr);
      }
      form.changeWinPoints(tournament.win_points);
      form.changeDrawPoints(tournament.draw_points);
      form.changeLossPoints(tournament.loss_points);
      form.changeShowOnlyUsernames(tournament.show_only_usernames);
      form.changeChatEnabled(tournament.chat_enabled);
      form.changeBannerPicture(tournament.banner_picture || "");
      form.changeProfilePicture(tournament.profile_picture || "");
      form.changeRemoveInactive(tournament.remove_inactive_participants);
      if (tournament.per_team_limit) {
        form.changePerTeam!(tournament.per_team_limit);
      }
      form.changeTb1(
        tournament.tb1 ? (TIEBREAKER as any)[tournament.tb1].toString() : ""
      );
      form.changeTb2(
        tournament.tb2 ? (TIEBREAKER as any)[tournament.tb2].toString() : ""
      );
      form.changeTb3(
        tournament.tb3 ? (TIEBREAKER as any)[tournament.tb3].toString() : ""
      );
      form.changeTb4(
        tournament.tb4 ? (TIEBREAKER as any)[tournament.tb4].toString() : ""
      );
      if (tournament.rounds) {
        form.changeRounds!(tournament.rounds);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>{title("editTournament")}</title>
      </Helmet>
      <h1 className="mt-5 p-3">
        <Translated str="editTournament" />
      </h1>
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
