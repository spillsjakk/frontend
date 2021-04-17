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

export interface Category {
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  banner_picture: string;
  visible: boolean;
  league: string;
  gender_restricted: boolean;
  f_restricted: boolean;
  age_restricted: boolean;
  minimum_age: number;
  maximum_age: number;
  rating_restricted: boolean;
  minimum_rating: number;
  maximum_rating: number;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  profile_picture: string;
  banner_picture: string;
  visible: boolean;
  league: string;
  start_date: string;
  end_date: string;
}

const LeagueContext: Context<
  Partial<{
    league: League;
    seasons: Array<Season>;
    categories: Array<Category>;
    fetchLeague: () => void;
    fetchCategories: () => void;
    fetchSeasons: () => void;
  }>
> = React.createContext({});

export const LeagueProvider = LeagueContext.Provider;
export default LeagueContext;
export const useLeague = () => useContext(LeagueContext);

interface Props {
  id: string;
}

const WithLeague: FunctionComponent<Props> = ({ id, children }) => {
  const [league, setLeague] = useState<League>();
  const [categories, setCategories] = useState<Array<Category>>();
  const [seasons, setSeasons] = useState<Array<Season>>();

  function fetchLeague() {
    fetchCall(`/s/leagues/${id}`, "GET", undefined, (result) => {
      setLeague(result);
    });
  }

  function fetchCategories() {
    fetchCall(`/s/leagues/${id}/categories`, "GET", undefined, (result) => {
      setCategories(result);
    });
  }

  function fetchSeasons() {
    fetchCall(`/s/leagues/${id}/seasons`, "GET", undefined, (result) => {
      setSeasons(result);
    });
  }

  useEffect(() => {
    fetchLeague();
    fetchCategories();
    fetchSeasons();
  }, []);

  return (
    <LeagueProvider
      value={{
        league,
        seasons,
        categories,
        fetchLeague,
        fetchCategories,
        fetchSeasons,
      }}
    >
      {children}
    </LeagueProvider>
  );
};

export { WithLeague };
