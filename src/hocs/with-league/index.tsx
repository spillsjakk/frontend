import { fetchCall } from "../../functions";
import { Tournament } from "../../pages/Tournament/Types";
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
  ended: boolean;
}

export interface SeasonsCategories {
  season: string;
  category: string;
  tournament: string;
}

const LeagueContext: Context<
  Partial<{
    league: League;
    seasons: Array<Season>;
    categories: Array<Category>;
    seasonsCategories: Array<SeasonsCategories>;
    tournaments: Array<Record<string, Tournament>>;
    fetchLeague: () => void;
    fetchCategories: () => void;
    fetchSeasons: () => void;
    fetchTournaments: () => void;
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
  const [seasonsCategories, setSeasonsCategories] =
    useState<Array<SeasonsCategories>>();
  const [tournaments, setTournaments] =
    useState<Array<Record<string, Tournament>>>();

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

  function fetchSeasonsCategories() {
    fetchCall(
      `/s/leagues/${id}/seasons-categories`,
      "GET",
      undefined,
      (result) => {
        setSeasonsCategories(result);
      }
    );
  }

  function fetchTournaments() {
    fetchCall(`/s/leagues/${id}/tournaments`, "GET", undefined, (result) => {
      if (Array.isArray(result)) {
        const tournaments = {};
        for (const tournament of result) {
          const season = seasons.find(
            (season) => season.id === tournament.season
          );
          if (season) {
            if (Array.isArray(tournaments[season.name])) {
              tournaments[season.name].push(tournament);
            } else {
              tournaments[season.name] = [tournament];
            }
          }
        }
        setTournaments(tournaments as any);
      }
    });
  }

  useEffect(() => {
    fetchLeague();
    fetchCategories();
    fetchSeasons();
    fetchSeasonsCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(seasons) && seasons.length > 0) {
      fetchTournaments();
    }
  }, [seasons]);
  return (
    <LeagueProvider
      value={{
        league,
        seasons,
        categories,
        tournaments,
        seasonsCategories,
        fetchLeague,
        fetchCategories,
        fetchSeasons,
        fetchTournaments,
      }}
    >
      {children}
    </LeagueProvider>
  );
};

export { WithLeague };
