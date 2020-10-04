import React, { FunctionComponent } from "react";
import { useForm } from "../../context/build-tournament-form";
import Translated from "../Translated";

const ShortFormInputs: FunctionComponent<{}> = () => {
  const form = useForm();
  return (
    <>
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
export { ShortFormInputs };
