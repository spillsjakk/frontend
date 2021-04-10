import { fetchCall } from "../../functions";
import React, {
  Context,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";

export interface League {
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  banner_picture: string;
  visible: boolean;
  organization: string;
  club: string;
}

const LeagueContext: Context<
  Partial<{
    league: League;
  }>
> = React.createContext({});

export const LeagueProvider = LeagueContext.Provider;
export default LeagueContext;
export const useLeague = () => useContext(LeagueContext);

interface Props {
  id: string;
}

const WithLeague: FunctionComponent<Props> = ({ id, children }) => {
  const [league, setLeague] = useState();
  function fetchLeague() {
    fetchCall(`/s/leagues/${id}`, "GET", undefined, (result) => {
      setLeague(result);
    });
  }
  useEffect(() => {
    fetchLeague();
  }, []);
  return <LeagueProvider value={{ league }}>{children}</LeagueProvider>;
};

export { WithLeague };
