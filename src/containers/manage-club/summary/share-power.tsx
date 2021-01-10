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
    <div id={style["share-power"]}>
      <div className={style.label}>
        {Translated.byKey("manageOrg_sharePower")}
      </div>
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
          <strong>{Translated.byKey("manageOrg_allPowersPackage")}</strong>
          <div>{Translated.byKey("manageOrg_allPowersPackageDesc")}</div>
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
          <strong>{Translated.byKey("manageOrg_arbiterPowersPackage")}</strong>
          <div>{Translated.byKey("manageOrg_arbiterPowersPackageDesc")}</div>
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
          <strong>{Translated.byKey("manageOrg_editorPowersPackage")}</strong>
          <div>{Translated.byKey("manageOrg_editorPowersPackageDesc")}</div>
        </div>
      </div>
    </div>
  );
};

export { SharePowerSummary };
