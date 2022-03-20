import { Box, Button, TextField } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import Translated from "../../../components/translated";
import { useTournamentDetail } from "../../../context/tournament-detail";
import { fetchCall } from "../../../functions";
import { usePopup } from "../../../hocs/popup";

interface Props {
  tournamentId?: string;
  teamId?: string;
  memberCount?: number;
}

const ChangeMemberCount: FunctionComponent<Props> = (props) => {
  const [memberCount, setMemberCount] = React.useState(props.memberCount || 40);
  const popup = usePopup();
  const { update } = useTournamentDetail();
  async function changeMemberCount() {
    fetchCall(
      `/s/tournament/team/${props.tournamentId}/${props.teamId}`,
      "PATCH",
      {
        member_count: Number(memberCount),
      },
      () => {
        popup.changeOpen(false);
        update();
      }
    );
  }
  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        label={Translated.byKey("teamSize")}
        value={memberCount}
        onChange={(e: any) => setMemberCount(e.target.value)}
      />
      <Button onClick={changeMemberCount}>{Translated.byKey("edit")}</Button>
    </Box>
  );
};

export { ChangeMemberCount };
