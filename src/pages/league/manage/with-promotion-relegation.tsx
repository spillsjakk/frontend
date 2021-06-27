import { fetchCall } from "../../../functions";
import React, {
  FunctionComponent,
  useCallback,
  useState,
  Context,
  useContext,
  useEffect,
} from "react";

export type PromotionRelegation = {
  season: string;
  oldCategory: string;
  newCategory: string;
  userId: string;
  newCategoryName: string;
  oldCategoryName: string;
  firstName: string;
  lastName: string;
  seasonName: string;
};

export interface FormContext {
  promotionRelegationList: Array<PromotionRelegation>;
  refresh: () => void;
}

const initalValues: FormContext = {
  promotionRelegationList: [],
  refresh: () => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const usePromotionRelegation = () => useContext(FormContext);

const WithPromotionRelegation: FunctionComponent<{
  leagueId: string;
  seasonId: string;
}> = ({ children, leagueId, seasonId }) => {
  const [promotionRelegationList, setPromotionRelegationList] = useState([]);

  function fetchPromotionRelegation() {
    fetchCall(
      `/s/leagues/${leagueId}/seasons/${seasonId}/promotion-relegation`,
      "GET",
      undefined,
      (response) => {
        if (Array.isArray(response)) {
          setPromotionRelegationList(
            response.map((r) => ({
              userId: r.user_id,
              newCategory: r.new_category,
              oldCategory: r.old_category,
              season: r.season,
              newCategoryName: r.new_category_name,
              oldCategoryName: r.old_category_name,
              firstName: r.first_name,
              lastName: r.last_name,
              seasonName: r.season_name,
            }))
          );
        }
      }
    );
  }

  useEffect(() => {
    if (leagueId && seasonId) {
      fetchPromotionRelegation();
    }
  }, [leagueId, seasonId]);

  const refresh = useCallback(() => {
    fetchPromotionRelegation();
  }, [leagueId, seasonId]);

  return (
    <FormContext.Provider
      value={{
        promotionRelegationList,
        refresh,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export { WithPromotionRelegation };
