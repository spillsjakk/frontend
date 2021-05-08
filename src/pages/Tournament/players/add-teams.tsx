import {
  Button,
  ListItem,
  ListItemText,
  ListSubheader,
  List,
  ListItemIcon,
  Checkbox,
} from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Team, TeamParticipant } from "../Types";
import { usePopup } from "../../../hocs/popup/index";
import Translated from "../../../components/translated";
import { fetchJson } from "../../../functions";

interface Props {
  teams: Team[];
  clubs: {
    name: string;
    id: string;
  }[];
  teamsAdded: TeamParticipant[];
  tournamentId: string;
  onSuccess: () => void;
}

const AddTeams: FunctionComponent<Props> = ({
  teams,
  clubs,
  teamsAdded,
  tournamentId,
  onSuccess,
}) => {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);

  const { changeOpen } = usePopup();

  useEffect(() => {
    if (Array.isArray(teams) && teams.length > 0) {
      const result = {};

      teams.forEach((team) => {
        if (team.club && !result[team.club]) {
          result[team.club] = [team];
        } else if (team.club && result[team.club]) {
          result[team.club].push(team);
        }
      });

      setData(result);
    }
  }, [teams]);

  async function addTeam(team: string) {
    return new Promise((resolve) =>
      fetchJson(
        `/s/tournament/add-team/${tournamentId}/${team}`,
        "POST",
        undefined,
        (result) => {
          resolve("");
        }
      )
    );
  }

  return (
    <div className="add-team-popup">
      <List>
        {Object.keys(data).length > 0 &&
          Object.keys(data).map((clubId, i) => (
            <div key={i}>
              <ListSubheader>
                {Array.isArray(clubs)
                  ? clubs.find((c) => c.id === clubId)?.name
                  : ""}
              </ListSubheader>
              <ul>
                {Array.isArray(data[clubId]) &&
                  data[clubId].map((team, i) => (
                    <ListItem
                      key={i}
                      disabled={!!teamsAdded.find((t) => t.team_id === team.id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          disabled={
                            !!teamsAdded.find((t) => t.team_id === team.id)
                          }
                          checked={selected.includes(team.id)}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          onChange={() => {
                            if (selected.includes(team.id)) {
                              setSelected(
                                selected.filter((s) => s !== team.id)
                              );
                            } else {
                              const newSelected = [...selected];
                              newSelected.push(team.id);
                              setSelected(newSelected);
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>
                        {team.name}{" "}
                        {team.id ===
                        `_${clubs.find((c) => c.id === clubId)?.id}`
                          ? `--${Translated.byKey("primary")}--`
                          : ""}
                      </ListItemText>
                    </ListItem>
                  ))}
              </ul>
            </div>
          ))}
      </List>
      <Button
        color="primary"
        variant="outlined"
        onClick={async () => {
          for (let i = 0; i < selected.length; i++) {
            await addTeam(selected[i]);
          }
          onSuccess();
          changeOpen(false);
        }}
      >
        {Translated.byKey("add")}
      </Button>
    </div>
  );
};

const AddTeamsButton: FunctionComponent<{}> = () => {
  const { changeOpen } = usePopup();
  return (
    <div>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          changeOpen(true);
        }}
      >
        {Translated.byKey("addTeams")}
      </Button>
    </div>
  );
};

export { AddTeams, AddTeamsButton };
