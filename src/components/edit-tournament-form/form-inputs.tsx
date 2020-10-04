import React, { FunctionComponent } from "react";
import { useForm } from "../../context/build-tournament-form";
import Translated from "../Translated";
import { TiebreakerDropdown } from "../tie-breaker-dropdown";
import { Countdown } from "../../components/count-down/index";

const FormInputs: FunctionComponent<{}> = () => {
  const form = useForm();
  return (
    <>
      <div className="form-group">
        <label htmlFor="name">
          <Translated str="tournamentName" />:
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={(e) => form.changeName(e.target.value)}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="description">
          <Translated str="description" />:
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          required
          value={form.description}
          onChange={(e) => form.changeDescription(e.target.value)}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="start_date">
          <Translated str="startDate" />:
        </label>
        <input
          type="date"
          id="start_date"
          className="form-control w-25"
          name="start_date"
          required
          min="2000-01-01"
          max="2099-12-31"
          value={form.startDate}
          onChange={(e) => form.changeStartDate(e.target.value)}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="end_date">
          <Translated str="endDate" />:
        </label>
        <input
          type="date"
          id="end_date"
          className="form-control w-25"
          name="end_date"
          required
          min="2000-01-01"
          max="2099-12-31"
          value={form.endDate}
          onChange={(e) => form.changeEndDate(e.target.value)}
        />
      </div>
      <div className="form-check mt-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="publicly_viewable"
          name="publicly_viewable"
          checked={form.publiclyViewable}
          onChange={(e) => form.changePubliclyViewable(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="publicly_viewable">
          <Translated str="publiclyViewable" />
        </label>
      </div>
      <div className="form-check mt-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="self_joinable"
          name="self_joinable"
          checked={form.selfJoinable}
          onChange={(e) => form.changeSelfJoinable(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="self_joinable">
          <Translated str="allowSelfJoining" />
        </label>
      </div>
      <div className="form-check mt-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="fide_rated"
          name="fide_rated"
          checked={form.fideRated}
          onChange={(e) => form.changeFideRated(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="fide_rated">
          <Translated str="fideRated" />
        </label>
      </div>
      <div className="mt-4">
        <label>
          <Translated str="type" />:
        </label>
      </div>
      <div className="d-flex flex-row">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind0"
            value={0}
            required
            checked={form.kind === 0}
            onChange={(e) => form.changeKind(0)}
          />
          <label className="form-check-label" htmlFor="kind0">
            <Translated str="knockout" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind1"
            value={1}
            checked={form.kind === 1}
            onChange={(e) => form.changeKind(1)}
          />
          <label className="form-check-label" htmlFor="kind1">
            <Translated str="swissDutch" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind2"
            value={2}
            checked={form.kind === 2}
            onChange={(e) => form.changeKind(2)}
          />
          <label className="form-check-label" htmlFor="kind2">
            <Translated str="teamKnockout" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind3"
            value={3}
            checked={form.kind === 3}
            onChange={(e) => form.changeKind(3)}
          />
          <label className="form-check-label" htmlFor="kind3">
            <Translated str="teamSwissDutch" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind4"
            value={4}
            checked={form.kind === 4}
            onChange={(e) => form.changeKind(4)}
          />
          <label className="form-check-label" htmlFor="kind4">
            <Translated str="teamMonrad" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="kind"
            id="kind5"
            value={5}
            checked={form.kind === 5}
            onChange={(e) => form.changeKind(5)}
          />
          <label className="form-check-label" htmlFor="kind5">
            <Translated str="teamKonrad" />
          </label>
        </div>
      </div>
      {![0, 2].includes(form.kind) && (
        <div className="form-group mt-4" id="roundNb-group">
          <label htmlFor="rounds">
            <Translated str="roundNb" />:
          </label>
          <input
            className="form-control w-25"
            type="number"
            id="rounds"
            name="rounds"
            value={form.rounds}
            onChange={(e) => form.changeRounds!(Number(e.target.value))}
          />
        </div>
      )}
      {[2, 3].includes(form.kind) && (
        <div className="form-group mt-4" id="nbMembers-group">
          <label htmlFor="per_team">
            <Translated str="membersPerTeam" />:
          </label>
          <input
            className="form-control w-25"
            type="number"
            id="per_team"
            name="per_team"
            value={form.perTeam}
            onChange={(e) => form.changePerTeam!(Number(e.target.value))}
          />
        </div>
      )}
      {form.kind === 1 && (
        <div className="form-group mt-4">
          <label htmlFor="tb1">
            <Translated str="tiebreaker" /> 1:
          </label>
          &nbsp;
          <TiebreakerDropdown
            value={form.tb1 as string}
            onChange={(e) => form.changeTb1(e.target.value)}
            id="tb1"
            name="tb1"
          />
          <br />
          <label htmlFor="tb2">
            <Translated str="tiebreaker" /> 2:
          </label>
          &nbsp;
          <TiebreakerDropdown
            value={form.tb2 as string}
            onChange={(e) => form.changeTb2(e.target.value)}
            id="tb2"
            name="tb2"
          />
          <br />
          <label htmlFor="tb3">
            <Translated str="tiebreaker" /> 3:
          </label>
          &nbsp;
          <TiebreakerDropdown
            value={form.tb3 as string}
            onChange={(e) => form.changeTb3(e.target.value)}
            id="tb3"
            name="tb3"
          />
          <br />
          <label htmlFor="tb4">
            <Translated str="tiebreaker" /> 4:
          </label>
          &nbsp;
          <TiebreakerDropdown
            value={form.tb4 as string}
            onChange={(e) => form.changeTb4(e.target.value)}
            id="tb4"
            name="tb4"
          />
          <br />
        </div>
      )}
      <div className="mt-4">
        <input
          type="checkbox"
          name="show_only_top"
          checked={form.showOnlyTop}
          onChange={(e) => form.changeShowOnlyTop(e.target.checked)}
        />
        &nbsp;
        <Translated str="onlyShowScoresOfTop" />
        &nbsp;
        <input
          type="number"
          name="show_only_top_nr"
          value={form.showOnlyTopNr}
          onChange={(e) => form.changeShowOnlyTopNr(Number(e.target.value))}
        />
      </div>
      <div className="mt-4">
        <label>
          <Translated str="defaultGameLocation" />:
        </label>
      </div>
      <div className="d-flex flex-row">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="dgl0"
            name="default_game_location"
            value={0}
            required
            onChange={(e) => form.changeDefaultGameLocation(0)}
            checked={form.defaultGameLocation === 0}
          />
          <label className="form-check-label" htmlFor="dgl0">
            <Translated str="otb" />
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="dgl1"
            name="default_game_location"
            value={1}
            onChange={(e) => form.changeDefaultGameLocation(1)}
            checked={form.defaultGameLocation === 1}
          />
          <label className="form-check-label" htmlFor="dgl1">
            <Translated str="online" />
          </label>
        </div>
      </div>
      <div className="mt-1">
        <small>
          <Translated str="gameLocationCanBeChanged" />
        </small>
      </div>
      <div className="form-group mt-4">
        <label htmlFor="first_pairing_date">
          <Translated str="firstPairingDateTime" /> (hh:mm,{" "}
          <Translated str="localTime" />
          !):
        </label>
        <input
          type="date"
          id="first_pairing_date"
          className="form-control w-25"
          name="first_pairing_date"
          style={{ display: "inline" }}
          required
          min="2000-01-01"
          max="2099-12-31"
          value={form.firstPairingDate}
          onChange={(e) => form.changeFirstPairingDate(e.target.value)}
        />
        <input
          type="text"
          id="first_pairing_time"
          className="form-control w-25"
          name="first_pairing_time"
          style={{ display: "inline" }}
          required
          pattern="\d\d?:\d\d"
          placeholder="13:00"
          value={form.firstPairingTime}
          onChange={(e) => form.changeFirstPairingTime(e.target.value)}
        />
        {form.firstPairingDate &&
          form.firstPairingTime &&
          form.firstPairingTime.length >= 5 && (
            <Countdown
              time={`${form.firstPairingDate} ${form.firstPairingTime}`}
            />
          )}
        <div className="mt-1">
          <small>
            <Translated str="ifNoOnlineGames" />
          </small>
        </div>
      </div>
      <div className="form-group mt-4">
        <label htmlFor="online_pairing_interval_n">
          <Translated str="onlinePairingInterval" />:
        </label>
        <input
          type="number"
          id="online_pairing_interval_n"
          className="form-control"
          style={{ width: "10%", display: "inline" }}
          name="online_pairing_interval_n"
          min="1"
          required
          value={form.onlinePairingIntervalN}
          onChange={(e) =>
            form.changeOnlinePairingIntervalN(Number(e.target.value))
          }
        />
        <select
          name="online_pairing_interval_t"
          value={form.onlinePairingIntervalT}
          onChange={(e) =>
            form.changeOnlinePairingIntervalT(Number(e.target.value))
          }
        >
          <option value={0}>minutes</option>
          <option value={1}>hours</option>
          <option value={2}>days</option>
          <option value={3} selected>
            weeks
          </option>
        </select>
      </div>
      <div className="form-group mt-4">
        <label htmlFor="initial_time">
          <Translated str="timeControl" />:
        </label>
        <input
          type="number"
          id="initial_time"
          className="form-control"
          style={{ width: "10%", display: "inline" }}
          min={1}
          name="initial_time"
          required
          value={form.initialTime}
          onChange={(e) => form.changeInitialTime(Number(e.target.value))}
        />
        +
        <input
          type="number"
          className="form-control"
          style={{ width: "10%", display: "inline" }}
          min="0"
          name="increment"
          required
          value={form.increment}
          onChange={(e) => form.changeIncrement(Number(e.target.value))}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="win_points">
          <Translated str="winPoints" />:
        </label>
        &nbsp;
        <input
          type="number"
          id="win_points"
          name="win_points"
          min="0"
          step="0.5"
          data-type="float"
          value={form.winPoints}
          onChange={(e) => form.changeWinPoints(Number(e.target.value))}
        />
        <br />
        <label htmlFor="draw_points">
          <Translated str="drawPoints" />:
        </label>
        &nbsp;
        <input
          type="number"
          id="draw_points"
          name="draw_points"
          min="0"
          step="0.5"
          data-type="float"
          value={form.drawPoints}
          onChange={(e) => form.changeDrawPoints(Number(e.target.value))}
        />
        <br />
        <label htmlFor="loss_points">
          <Translated str="lossPoints" />:
        </label>
        &nbsp;
        <input
          type="number"
          id="loss_points"
          name="loss_points"
          min="0"
          step="0.5"
          data-type="float"
          value={form.lossPoints}
          onChange={(e) => form.changeLossPoints(Number(e.target.value))}
        />
      </div>
    </>
  );
};
export { FormInputs };
