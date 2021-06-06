import React, { FunctionComponent, useState } from "react";
import { InputAdd } from "../../../../components/input-add";
import Translated from "../../../../components/translated";
import style from "../style.module.scss";
import Toggle from "react-bootstrap-toggle";
import { useOrganization } from "../../../../context/organization";
import { fetchJson } from "../../../../functions";

const SharePowerSummary: FunctionComponent<{}> = () => {
  const [allPackage, setAllPackage] = useState(false);
  const [arbiterPackage, setArbiterPackage] = useState(false);
  const [editorPackage, setEditPackage] = useState(false);
  const organization = useOrganization();
  function save(id: string) {
    const data = [];
    if (allPackage) {
      data.push("all");
    }
    if (arbiterPackage) {
      data.push("arbiter");
    }
    if (editorPackage) {
      data.push("editor");
    }

    fetchJson(
      `/s/account/add-power/organization/${id}`,
      "POST",
      { powers: data, id: organization.id },
      () => {
        organization.updateData!();
      }
    );
  }
  return (
    <div id={style["share-power"]}>
      <div className={style.label}>
        {Translated.byKey("manageOrg_sharePower")}
      </div>
      <InputAdd onAction={save} placeholder={Translated.byKey("addPlayerId")} />
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
