import React, { FunctionComponent, useState } from "react";
import { Select, Typography } from "@material-ui/core";
import Translated from "../../../../components/translated/index";
import { Club } from "../../Statistics";
import { Stats as ClubStats } from "../../../Club/manage/detail/stats";

interface Props {
  clubs: Array<Club>;
}

const Stats: FunctionComponent<Props> = ({ clubs }) => {
  const [club, setClub] = useState<Club>();
  return (
    <div className="d-flex flex-column">
      <Typography variant="h5">{Translated.byKey("filterByClub")}</Typography>
      <Select
        onChange={(e) => {
          setClub(clubs.find((c) => c.id === e.target.value));
        }}
        variant="outlined"
        value={club ? club.id : "0"}
        native
      >
        <option value="0">{Translated.byKey("pleaseSelect")}</option>
        {Array.isArray(clubs) &&
          clubs.map((club) => (
            <option value={club.id} key={club.name}>
              {club.name}
            </option>
          ))}
      </Select>
      {club && <ClubStats id={club.id} region={club.region} />}
    </div>
  );
};

export { Stats };
