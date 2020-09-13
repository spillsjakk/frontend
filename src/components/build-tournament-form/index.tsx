import React, { FunctionComponent } from "react";
import Translated from "../Translated";

interface Props {}

const BuildTournamentForm: FunctionComponent<Props> = () => {
  return (
    <>
      <form className="mt-5" onSubmit={this.submit}>
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
            value={this.state.name}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group mt-4">
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            className="form-control"
            id="id"
            name="id"
            required
            pattern="[A-Za-z0-9_-]+"
            value={this.state.id}
            onChange={this.handleChange}
          />
          <div className="mt-1">
            <small>
              <Translated str="theUrlForThisTournament" />
            </small>
          </div>
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
            value={this.state.description}
            onChange={this.handleChange}
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
            value={this.state.start_date}
            onChange={this.handleChange}
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
            value={this.state.end_date}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-check mt-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="publicly_viewable"
            name="publicly_viewable"
            checked={this.state.publicly_viewable}
            onChange={this.handleChangeCheckbox}
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
            checked={this.state.self_joinable}
            onChange={this.handleChangeCheckbox}
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
            checked={this.state.fide_rated}
            onChange={this.handleChangeCheckbox}
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
              checked={this.state.kind === 0}
              onChange={this.handleChange}
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
              checked={this.state.kind === 1}
              onChange={this.handleChange}
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
              checked={this.state.kind === 2}
              onChange={this.handleChange}
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
              checked={this.state.kind === 3}
              onChange={this.handleChange}
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
              checked={this.state.kind === 4}
              onChange={this.handleChange}
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
              checked={this.state.kind === 5}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor="kind5">
              <Translated str="teamKonrad" />
            </label>
          </div>
        </div>
        {![0, 2].includes(this.state.kind) && (
          <div className="form-group mt-4" id="roundNb-group">
            <label htmlFor="rounds">
              <Translated str="roundNb" />:
            </label>
            <input
              className="form-control w-25"
              type="number"
              id="rounds"
              name="rounds"
              value={this.state.rounds}
              onChange={this.handleChange}
            />
          </div>
        )}
        {[2, 3].includes(this.state.kind) && (
          <div className="form-group mt-4" id="nbMembers-group">
            <label htmlFor="per_team">
              <Translated str="membersPerTeam" />:
            </label>
            <input
              className="form-control w-25"
              type="number"
              id="per_team"
              name="per_team"
              value={this.state.per_team}
              onChange={this.handleChange}
            />
          </div>
        )}
        {this.state.kind === 1 && (
          <div className="form-group mt-4">
            <label htmlFor="tb1">
              <Translated str="tiebreaker" /> 1:
            </label>
            &nbsp;
            <TiebreakerDropdown
              value={this.state.tb1 as string}
              onChange={this.handleChange}
              id="tb1"
              name="tb1"
            />
            <br />
            <label htmlFor="tb2">
              <Translated str="tiebreaker" /> 2:
            </label>
            &nbsp;
            <TiebreakerDropdown
              value={this.state.tb2 as string}
              onChange={this.handleChange}
              id="tb2"
              name="tb2"
            />
            <br />
            <label htmlFor="tb3">
              <Translated str="tiebreaker" /> 3:
            </label>
            &nbsp;
            <TiebreakerDropdown
              value={this.state.tb3 as string}
              onChange={this.handleChange}
              id="tb3"
              name="tb3"
            />
            <br />
            <label htmlFor="tb4">
              <Translated str="tiebreaker" /> 4:
            </label>
            &nbsp;
            <TiebreakerDropdown
              value={this.state.tb4 as string}
              onChange={this.handleChange}
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
            checked={this.state.show_only_top}
            onChange={this.handleChangeCheckbox}
          />
          &nbsp;
          <Translated str="onlyShowScoresOfTop" />
          &nbsp;
          <input
            type="number"
            name="show_only_top_nr"
            value={this.state.show_only_top_nr}
            onChange={this.handleChange}
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
              onChange={this.handleChange}
              checked={this.state.default_game_location === 0}
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
              onChange={this.handleChange}
              checked={this.state.default_game_location === 1}
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
            value={this.state.first_pairing_date}
            onChange={this.handleChange}
          />
          <input
            type="text"
            id="first_pairing_time"
            className="form-control w-25"
            name="first_pairing_time"
            style={{ display: "inline" }}
            required
            pattern="\d\d?:\d\d"
            value={this.state.first_pairing_time}
            onChange={this.handleChange}
          />
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
            value={this.state.online_pairing_interval_n}
            onChange={this.handleChange}
          />
          <select
            name="online_pairing_interval_t"
            value={this.state.online_pairing_interval_t}
            onChange={this.handleChange}
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
            value={this.state.initial_time}
            onChange={this.handleChange}
          />
          +
          <input
            type="number"
            className="form-control"
            style={{ width: "10%", display: "inline" }}
            min="0"
            name="increment"
            required
            value={this.state.increment}
            onChange={this.handleChange}
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
            value={this.state.win_points}
            onChange={this.handleChange}
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
            value={this.state.draw_points}
            onChange={this.handleChange}
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
            value={this.state.loss_points}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group mt-4">
          <button type="submit" className="btn btn-success p-3">
            <strong>
              <Translated str="buildAndInvite" />
            </strong>
          </button>
        </div>
      </form>
    </>
  );
};
export { BuildTournamentForm };
