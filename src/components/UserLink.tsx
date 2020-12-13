import React from "react";
import { Link } from "react-router-dom";

type UserLinkProps = {
  id: string;
  name: string;
  ghost: boolean;
};

function UserLink(props: UserLinkProps) {
  if (props.ghost) {
    return <>{props.name}</>;
  } else {
    return <Link to={"/profile/" + props.id}>{props.name}</Link>;
  }
}

export default UserLink;
