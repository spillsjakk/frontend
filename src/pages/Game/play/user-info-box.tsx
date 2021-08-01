import React, { FunctionComponent } from "react";
import UserLink from "../../../components/UserLink";

interface Props {
  federation?: string;
  id: string;
  name: string;
}

const UserInfoBox: FunctionComponent<Props> = ({ id, name, federation }) => {
  return (
    <div className="user-info">
      {federation && (
        <img src={`https://drulpact.sirv.com/sp/flags/${federation}.png`} />
      )}
      <div className="name">
        <UserLink id={id} name={name} ghost={false} />
      </div>
    </div>
  );
};
export { UserInfoBox };
