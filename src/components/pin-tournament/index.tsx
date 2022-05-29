import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { FormEvent, FunctionComponent } from "react";
import { useNotification } from "../../hocs/with-notification";
import { Tournament } from "../../pages/Tournament/Types";
import Translated from "../translated";

interface Props {
  tournament: Tournament;
  onSuccess: () => void;
}

const PinTournament: FunctionComponent<Props> = (props) => {
  const [pinned, setPinned] = React.useState(
    typeof props.tournament.pinned === "boolean"
      ? props.tournament.pinned
      : false
  );
  const [pinnedOrder, setPinnedOrder] = React.useState(
    typeof props.tournament.pinned_order === "number"
      ? props.tournament.pinned_order
      : 0
  );

  const { notify } = useNotification();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const response = await fetch(`/s/tournament/${props.tournament.id}/pin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinned,
        pinned_order: pinnedOrder,
      }),
    });
    if (response.ok) {
      notify("success", Translated.byKey("updatePinSuccessfulMessage"));
      props.onSuccess();
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <Grid
        container
        spacing={3}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <FormControlLabel
            className="toogle-text"
            control={
              <Checkbox
                checked={pinned}
                onChange={(e: any) => {
                  setPinned(e.target.checked);
                }}
                color="primary"
              />
            }
            label={Translated.byKey("pinned")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          {pinned && (
            <TextField
              label={Translated.byKey("pinnedOrder")}
              type="number"
              value={pinnedOrder}
              onChange={(e) => setPinnedOrder(Number(e.target.value))}
              fullWidth
              variant="outlined"
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Button type="submit" variant="contained" color="primary">
            <Translated str="save" />
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export { PinTournament };
