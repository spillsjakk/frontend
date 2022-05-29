import React, {
  Context,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Tournament } from "../../pages/Tournament/Types";
import { fetchJson } from "../../functions";

export interface TournamentsContext {
  tournaments: Array<Tournament>;
}

const TournamentsContext: Context<Partial<TournamentsContext>> =
  React.createContext({});

export const TournamentsProvider = TournamentsContext.Provider;
export default TournamentsContext;
export const useAllTournaments = () => useContext(TournamentsContext);

const WithAllTournaments: FunctionComponent<unknown> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
  useEffect(() => {
    fetchJson("/s/tournament/list", "GET", undefined, (json) => {
      if (json && Array.isArray(json.data)) {
        setTournaments(json.data);
      }
    });
  }, []);
  return (
    <TournamentsProvider value={{ tournaments }}>
      {children}
    </TournamentsProvider>
  );
};

export { WithAllTournaments };
