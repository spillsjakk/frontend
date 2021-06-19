import React, { FunctionComponent } from "react";
import { useForm } from "../../../hocs/tournament-form";
import { Editor } from "../../../components/markdown";
import Translated from "../../../components/translated";

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
        <Editor
          value={form.description}
          onChange={(value) => form.changeDescription(value)}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="id">{Translated.byKey("profile_picture")}</label>
        <input
          type="text"
          className="form-control"
          id="profile-picture"
          name="profile-picture"
          value={form.profilePicture}
          onChange={(e) => form.changeProfilePicture(e.target.value)}
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="id">{Translated.byKey("banner_picture")}</label>
        <input
          type="text"
          className="form-control"
          id="banner-picture"
          name="banner-picture"
          value={form.bannerPicture}
          onChange={(e) => form.changeBannerPicture(e.target.value)}
        />
        <span>{Translated.byKey("tournamentBuildBannerDesc")}</span>
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
          <option value={3}>weeks</option>
        </select>
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
        <input
          type="checkbox"
          name="show_only_top"
          checked={form.chatEnabled}
          onChange={(e) => form.changeChatEnabled(e.target.checked)}
        />
        &nbsp;
        <Translated str="chatEnabled" />
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
