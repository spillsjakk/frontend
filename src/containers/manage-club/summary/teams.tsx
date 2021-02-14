import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { HelpBox, helpboxNames } from "../../../components/help-box";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import { useClub } from "../../../context/club";
import { fetchJson } from "../../../functions";
import style from "../style.module.scss";

const TeamsSummary: FunctionComponent<{}> = () => {
  const club = useClub();
  function removeTeam(id: string) {
    fetchJson(`/s/club/remove-team/${club.id}`, "POST", { name: id }, () => {
      club.updateData!();
    });
  }
  function addTeam(id: string) {
    fetchJson(`/s/club/add-team/${club.id}`, "POST", { name: id }, () => {
      club.updateData!();
    });
  }
  return (
    <HelpBox
      placement="bottom"
      name={helpboxNames.clubManageTeams}
      text={Translated.byKey("clubManageTeamsHelpbox")}
      show={true}
    >
      <>
        <div className={style.label}>
          {Translated.byKey("manageClub_teamsInClub")}
        </div>
        <InputAdd
          onAction={addTeam}
          pattern="[a-zA-Z0-9-_\s]+"
          placeholder={Translated.byKey("manageClub_addNewTeam")}
        />
        <div className={style.items}>
          {Array.isArray(club.teams) &&
            club.teams.map((team) => (
              <div key={team.id} className={style.item}>
                <div>
                  <Link to={"/team/view/" + team.id}>{team.name}</Link>
                </div>
                <div>
                  <a
                    className="btn btn-danger"
                    onClick={() => removeTeam(team.id)}
                  >
                    X
                  </a>
                </div>
              </div>
            ))}
        </div>
      </>
    </HelpBox>
  );
};

export { TeamsSummary };
