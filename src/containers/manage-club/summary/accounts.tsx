import React, { FunctionComponent } from "react";
import style from "../style.module.scss";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import UserLink from "../../../components/UserLink";
import { useClub } from "../../../context/club";
import { fetchJson } from "../../../functions";

const AccountsSummary: FunctionComponent<{}> = () => {
  const club = useClub();
  return (
    <>
      <div className={style.label}>
        {Translated.byKey("manageClub_accounts")}
      </div>
      <InputAdd
        onAction={(newId: string) => {
          fetchJson(
            `/s/club/add-member/${club.id}/${newId}`,
            "POST",
            undefined,
            () => {
              club.updateData!();
            }
          );
        }}
        placeholder={Translated.byKey("addPlayerId")}
      />
      <div className={style.items}>
        {Array.isArray(club.members) &&
          club.members.map((account) => (
            <div key={account.account_id} className={style.item}>
              <UserLink
                id={account.account_id}
                name={account.first_name}
                ghost={false}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export { AccountsSummary };
