import React, { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "../../context/build-tournament-form";
import { useTemplate } from "../../context/build-tournament-template";
import { placeholder } from "../../hocs/build-tournament-template";
import Translated from "../Translated";

const ShortForm: FunctionComponent<{}> = () => {
  const form = useForm();
  const { selectedTemplate } = useTemplate();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selectedTemplate !== placeholder.value && form.startDate === "") {
      setVisible(true);
    }
  }, [selectedTemplate]);

  const submit = () => {
    if (form.defaultGameLocation === 0) {
      form.changeFirstPairingDate(form.startDate);
      form.changeFirstPairingTime("12:00");
    }
    form.changeShow(true);
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <form className="mt-5" onSubmit={submit}>
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

export { ShortForm };
