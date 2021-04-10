import React, {
  Context,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchCall } from "../../functions";

type Org = { id: string; name: string };

export interface OrgsClubs {
  orgs: Array<Org>;
  clubs: Array<Org>;
}

const OrgsClubsContext: Context<Partial<OrgsClubs>> = React.createContext({});

export const OrgsClubsProvider = OrgsClubsContext.Provider;
export default OrgsClubsContext;
export const useOrgsClubs = () => useContext(OrgsClubsContext);

type Powers = {
  clubs: {
    all: Array<string>;
    arbiter: Array<string>;
    editor: Array<string>;
    manager: Array<string>;
  };
  organizations: {
    all: Array<string>;
    arbiter: Array<string>;
    editor: Array<string>;
    manager: Array<string>;
  };
  team: {
    captain: Array<string>;
  };
};

const WithUserOrgsClubs: FunctionComponent<{}> = (props) => {
  const [orgs, setOrgs] = useState([]);
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    fetchCall("/s/account/powers", "GET", undefined, async (data: Powers) => {
      if (data && data.organizations) {
        const organizations = [];
        const ids = new Set([
          ...data.organizations.all,
          ...data.organizations.arbiter,
          ...data.organizations.manager,
        ]);
        for (const item of ids) {
          await fetchCall(
            `/s/organization/get/${item}`,
            "GET",
            undefined,
            (response) => {
              if (response && response.name) {
                organizations.push({ id: item, name: response.name });
              }
            }
          );
        }
        setOrgs(organizations);
      }

      if (data && data.clubs) {
        const clubs = [];
        const ids = new Set([
          ...data.clubs.all,
          ...data.clubs.arbiter,
          ...data.clubs.manager,
        ]);
        for (const item of ids) {
          await fetchCall(
            `/s/club/get-info/${item}`,
            "GET",
            undefined,
            (response) => {
              if (response && response.name) {
                clubs.push({ id: item, name: response.name });
              }
            }
          );
        }
        setClubs(clubs);
      }
    });
  }, []);

  return (
    <OrgsClubsProvider value={{ orgs, clubs }}>
      {props.children}
    </OrgsClubsProvider>
  );
};

export { WithUserOrgsClubs };
