import React, { FunctionComponent, useEffect, useState } from "react";
import Translated from "../../../components/translated";
import { useUser } from "../../../components/UserContext";
import style from "./style.module.scss";
import { useParams, useHistory } from "react-router-dom";
import { fetchCall } from "../../../functions";
import { Button } from "@material-ui/core";

const ActionButton: FunctionComponent<{}> = () => {
  const {
    user: { authenticated },
  } = useUser();
  const [canManageLeague, setCanManageLeague] = useState(false);

  const params = useParams<{ leagueId: string }>();
  const history = useHistory();

  useEffect(() => {
    fetchCall(
      `/s/leagues/${params.leagueId}/permissions`,
      "GET",
      undefined,
      (result) => {
        if (result?.can_manage) {
          setCanManageLeague(true);
        }
      }
    );
  }, []);

  function onClickManage() {
    history.push(`/league/manage/${params.leagueId}`);
  }

  return (
    <>
      {authenticated && canManageLeague && (
        <div
          className={`${style["action-button"]} ${style["manage-tournament"]}`}
        >
          <Button
            variant="outlined"
            color="primary"
            className={style["absolute-right"]}
            onClick={onClickManage}
          >
            {Translated.byKey("manage")}
          </Button>
        </div>
      )}
    </>
  );
};

export { ActionButton };
