import React, { FunctionComponent, useState } from "react";
import { Select } from "@material-ui/core";
import Translated from "../../../../components/translated/index";
import { Club } from "../../../../context/club";

interface Props {
  clubs: Array<Club>;
  regions: Array<string>;
}

const Stats: FunctionComponent<Props> = ({ clubs, regions }) => {
  const [club, setClub] = useState<{ id: string; region: string }>(
    clubs.length > 0 && regions.length > 0
      ? { id: clubs[0].id, region: regions[0] }
      : { id: "0", region: "" }
  );
  return (
    <>
      <Select onChange={(e) => {}} variant="outlined" value={club.id} native>
        <option value="0">{Translated.byKey("pleaseSelect")}</option>
        {Array.isArray(clubs) &&
          clubs.map((club) => (
            <option value={club.id} key={club.name}>
              {club.name}
            </option>
          ))}
      </Select>
    </>
  );
};

export { Stats };
