import React, { FunctionComponent } from "react";
import style from "../style.module.scss";
import { InputAdd } from "../../../components/input-add";
import Translated from "../../../components/translated";
import { useOrganization } from "../../../context/organization";
import UserLink from "../../../components/UserLink";

const AccountsSummary: FunctionComponent<{}> = () => {
  const organization = useOrganization();
  return (
    <>
      <div className={style.label}>
        {Translated.byKey("manageOrg_orgsAccounts")}
      </div>
      <InputAdd
        onAction={() => {}}
        placeholder={Translated.byKey("addPlayerId")}
      />
      <div className={style.items}>
        {Array.isArray(organization.accounts) &&
          organization.accounts.map((account) => (
            <div key={account.id} className={style.item}>
              <UserLink
                id={account.id}
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
