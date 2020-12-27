import React, { FunctionComponent } from "react";
import { useForm } from "../../context/build-tournament-form";
import Translated from "../translated";

const ShortFormInputs: FunctionComponent<{}> = () => {
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
          style={{ height: "250px" }}
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
    </>
  );
};
export { ShortFormInputs };
