import React, { FunctionComponent, useState } from "react";
import { InputAdd } from "../../../../components/input-add";
import Translated from "../../../../components/translated";
import style from "../style.module.scss";
import Toggle from "react-bootstrap-toggle";
import { fetchJson } from "../../../../functions";
import { useClub } from "../../../../context/club";
import { Form } from "react-bootstrap";
import { HelpBox, helpboxNames } from "../../../../components/help-box";

const SharePowerSummary: FunctionComponent<{}> = () => {
  const [allPackage, setAllPackage] = useState(false);
  const [arbiterPackage, setArbiterPackage] = useState(false);
  const [editorPackage, setEditPackage] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [teamCaptain, setTeamCaptain] = useState(false);
  const club = useClub();
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

    if (teamCaptain && !teamId) {
      return;
    }

    if (teamCaptain && teamId) {
      data.push(`team:captain:${teamId}`);
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
    <div id={style["share-power"]}>
      <HelpBox
        placement="bottom"
        name={helpboxNames.clubManageSharePower}
        text={Translated.byKey("clubManageSharePowerHelpbox")}
        show={true}
      >
        <div className={style.label}>
          {Translated.byKey("manageOrg_sharePower")}
        </div>
      </HelpBox>
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
      <div className={style.item}>
        <div className={style.toggle}>
          <Toggle
            onClick={() => {
              if (!teamCaptain) {
                setArbiterPackage(false);
                setAllPackage(false);
              }
              setTeamCaptain(!teamCaptain);
            }}
            on={<div>ON</div>}
            off={<div>OFF</div>}
            size="xs"
            offstyle="danger"
            active={teamCaptain}
          />
        </div>
        <div className={style.text}>
          <strong>{Translated.byKey("manageClub_teamCaptainPackage")}</strong>
          <div>{Translated.byKey("manageClub_teamCaptainPackageDesc")}</div>
          {teamCaptain && (
            <Form.Control
              value={teamId}
              as="select"
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="" disabled>
                {Translated.byKey("pleaseSelect")}
              </option>
              {Array.isArray(club.teams) &&
                club.teams.map((team, i) => (
                  <option key={i} value={team.id}>
                    {team.name}
                  </option>
                ))}
            </Form.Control>
          )}
        </div>
      </div>
    </div>
  );
};

export { SharePowerSummary };
