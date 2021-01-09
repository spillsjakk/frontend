import React, { FunctionComponent, useState } from "react";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import style from "../style.module.scss";
import Toggle from "react-bootstrap-toggle";

const SharePowerSummary: FunctionComponent<{}> = () => {
  const [allPackage, setAllPackage] = useState(false);
  const [arbiterPackage, setArbiterPackage] = useState(false);
  const [editorPackage, setEditPackage] = useState(false);
  return (
    <div id={style["share-power-summary"]}>
      <div className={style.label}>Share powers with an account:</div>
      <InputAdd
        onAction={() => {}}
        placeholder={Translated.byKey("addPlayerId")}
      />
      <div className={style.item}>
        <div className={style.toggle}>
          <Toggle
            onClick={() => {
              if (!allPackage) {
                setEditPackage(false);
                setArbiterPackage(false);
              }
              setAllPackage(!allPackage);
            }}
            on={<div>ON</div>}
            off={<div>OFF</div>}
            size="xs"
            offstyle="danger"
            active={allPackage}
          />
        </div>
        <div className={style.text}>
          <strong>All powers package:</strong>
          <div>
            (this user will be able to do everything this Organization can do,
            in its name)
          </div>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.toggle}>
          <Toggle
            onClick={() => {
              if (!arbiterPackage) {
                setEditPackage(false);
                setAllPackage(false);
              }
              setArbiterPackage(!arbiterPackage);
            }}
            on={<div>ON</div>}
            off={<div>OFF</div>}
            size="xs"
            offstyle="danger"
            active={arbiterPackage}
          />
        </div>
        <div className={style.text}>
          <strong>Arbiter powers package:</strong>
          <div>
            (this user will have all arbiter powers in this Organization’s
            events, and can create events)
          </div>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.toggle}>
          <Toggle
            onClick={() => {
              if (!editorPackage) {
                setArbiterPackage(false);
                setAllPackage(false);
              }
              setEditPackage(!editorPackage);
            }}
            on={<div>ON</div>}
            off={<div>OFF</div>}
            size="xs"
            offstyle="danger"
            active={editorPackage}
          />
        </div>
        <div className={style.text}>
          <strong>Editor powers package:</strong>
          <div>
            (this user will have all author and editor powers, in all text
            fields the Organization controls)
          </div>
        </div>
      </div>
    </div>
  );
};

export { SharePowerSummary };
