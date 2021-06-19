import React, { FunctionComponent, useState } from "react";
import { Select, TextField, Typography } from "@material-ui/core";
import Translated from "../../../../components/translated/index";
import { Club } from "../../Statistics";
import { Stats as ClubStats } from "../../../Club/manage/detail/stats";
import { Autocomplete } from "@material-ui/lab";

interface Props {
  clubs: Array<Club>;
}

const Stats: FunctionComponent<Props> = ({ clubs }) => {
  const [selectedClubs, setSelectedClubs] = useState<Array<Club>>();
  return (
    <div className="d-flex flex-column">
      <Typography variant="h5">{Translated.byKey("filterByClub")}</Typography>
      <Autocomplete
        multiple
        options={clubs}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        onChange={(e, value) => { setSelectedClubs(value as any); }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={Translated.byKey("clubs")}
          />
        )}
      />
      {selectedClubs && <ClubStats clubs={selectedClubs} />}
    </div>
  );
};

export { Stats };
