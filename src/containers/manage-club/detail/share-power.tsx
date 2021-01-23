import React, { FunctionComponent, useState } from "react";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import style from "../style.module.scss";
import Toggle from "react-bootstrap-toggle";
import Collapse from "react-bootstrap/Collapse";
import { fetchJson } from "../../../functions";
import { useClub } from "../../../context/club";

const GetToggleItem: FunctionComponent<{
  onClick: () => void;
  active: boolean;
  header?: string;
  description: string;
}> = ({ onClick, active, header, description }) => {
  return (
    <div className={style.item}>
      <div className={style.toggle}>
        <Toggle
          onClick={onClick}
          on={<div>{Translated.byKey("on").toUpperCase()}</div>}
          off={<div>{Translated.byKey("off").toUpperCase()}</div>}
          size="xs"
          offstyle="danger"
          active={active}
        />
      </div>
      <div className={style.text}>
        {header && <strong>{header}</strong>}
        <div>{description}</div>
      </div>
    </div>
  );
};

const SharePowerDetail: FunctionComponent<{}> = () => {
  const [allPackage, setAllPackage] = useState(false);
  const [arbiterPackage, setArbiterPackage] = useState(false);
  const [editorPackage, setEditPackage] = useState(false);
  const [custom, setCustom] = useState(false);
  const [customPowers, setCustomPowers] = useState({
    arbiter1: false,
    arbiter2: false,
    arbiter3: false,
    editor1: false,
    editor2: false,
    misc1: false,
    misc2: false,
    misc3: false,
    misc4: false,
    misc5: false,
    misc6: false,
  });
  const club = useClub();
  function save(id: string) {
    const data = [];
    if (!custom) {
      if (allPackage) {
        data.push("all");
      }
      if (arbiterPackage) {
        data.push("arbiter");
      }
      if (editorPackage) {
        data.push("editor");
      }
    } else {
      if (customPowers.arbiter1) {
        data.push("arbiter1");
      }
      if (customPowers.arbiter2) {
        data.push("arbiter2");
      }
      if (customPowers.arbiter3) {
        data.push("arbiter3");
      }
      if (customPowers.editor1) {
        data.push("editor1");
      }
      if (customPowers.editor2) {
        data.push("editor2");
      }
      if (customPowers.misc1) {
        data.push("misc1");
      }
      if (customPowers.misc2) {
        data.push("misc2");
      }
      if (customPowers.misc3) {
        data.push("misc3");
      }
      if (customPowers.misc4) {
        data.push("misc4");
      }
      if (customPowers.misc5) {
        data.push("misc5");
      }
      if (customPowers.misc6) {
        data.push("misc6");
      }
    }
    fetchJson(
      `/s/account/add-power/club/${id}`,
      "POST",
      { powers: data, id: club.id },
      () => {
        club.updateData!();
      }
    );
  }
  return (
    <>
      <div id={style["share-power"]}>
        <div className={style.label}>
          {Translated.byKey("manageOrg_sharePower")}
        </div>
        <InputAdd
          onAction={save}
          placeholder={Translated.byKey("addPlayerId")}
        />
        <div
          id={style["predefined-powers"]}
          className={custom ? `${style.disabled}` : ""}
        >
          <GetToggleItem
            onClick={() => {
              if (!allPackage) {
                setEditPackage(false);
                setArbiterPackage(false);
              }
              setAllPackage(!allPackage);
            }}
            active={allPackage}
            header={Translated.byKey("manageOrg_allPowersPackage")}
            description={Translated.byKey("manageOrg_allPowersPackageDesc")}
          />
          <GetToggleItem
            onClick={() => {
              if (!arbiterPackage) {
                setEditPackage(false);
                setAllPackage(false);
              }
              setArbiterPackage(!arbiterPackage);
            }}
            active={arbiterPackage}
            header={Translated.byKey("manageOrg_arbiterPowersPackage")}
            description={Translated.byKey("manageOrg_arbiterPowersPackageDesc")}
          />
          <GetToggleItem
            onClick={() => {
              if (!editorPackage) {
                setArbiterPackage(false);
                setAllPackage(false);
              }
              setEditPackage(!editorPackage);
            }}
            active={editorPackage}
            header={Translated.byKey("manageOrg_editorPowersPackage")}
            description={Translated.byKey("manageOrg_editorPowersPackageDesc")}
          />
        </div>

        <button
          onClick={() => {
            setAllPackage(false);
            setArbiterPackage(false);
            setEditPackage(false);
            setCustom(!custom);
          }}
          aria-controls={style["custom-powers"]}
          aria-expanded={custom}
          className={style["custom-button"]}
        >
          {!custom
            ? Translated.byKey("manageOrg_useCustomPowers")
            : Translated.byKey("manageOrg_usePredefinedPowers")}
        </button>
        <Collapse in={custom}>
          <div id={style["custom-powers"]}>
            <div className={style.desc}>
              {Translated.byKey("manageOrg_customPowerDesc")}
            </div>
            <div>
              <strong>
                {Translated.byKey("manageOrg_arbiterPowersPackage")}
              </strong>
            </div>
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  arbiter1: !customPowers.arbiter1,
                });
              }}
              active={customPowers.arbiter1}
              description={Translated.byKey("manageOrg_arbiter1")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  arbiter2: !customPowers.arbiter2,
                });
              }}
              active={customPowers.arbiter2}
              description={Translated.byKey("manageOrg_arbiter2")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  arbiter3: !customPowers.arbiter3,
                });
              }}
              active={customPowers.arbiter3}
              description={Translated.byKey("manageOrg_arbiter3")}
            />

            <div>
              <strong>
                {Translated.byKey("manageOrg_editorPowersPackage")}
              </strong>
            </div>

            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  editor1: !customPowers.editor1,
                });
              }}
              active={customPowers.editor1}
              description={Translated.byKey("manageOrg_editor1")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  editor2: !customPowers.editor2,
                });
              }}
              active={customPowers.editor2}
              description={Translated.byKey("manageOrg_editor2")}
            />

            <div>
              <strong>{Translated.byKey("manageOrg_miscPowerPackage")}</strong>
            </div>

            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  misc1: !customPowers.misc1,
                });
              }}
              active={customPowers.misc1}
              description={Translated.byKey("manageClub_misc1")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  misc2: !customPowers.misc2,
                });
              }}
              active={customPowers.misc2}
              description={Translated.byKey("manageClub_misc2")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  misc3: !customPowers.misc3,
                });
              }}
              active={customPowers.misc3}
              description={Translated.byKey("manageClub_misc3")}
            />
            <GetToggleItem
              onClick={() => {
                setCustomPowers({
                  ...customPowers,
                  misc4: !customPowers.misc4,
                });
              }}
              active={customPowers.misc4}
              description={Translated.byKey("manageClub_misc4")}
            />
          </div>
        </Collapse>
      </div>
    </>
  );
};

export { SharePowerDetail };
