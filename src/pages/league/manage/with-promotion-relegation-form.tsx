import React, {
  FunctionComponent,
  useCallback,
  useState,
  Context,
  useContext,
} from "react";

type PromotionRelegation = {
  season: string;
  oldCategory: string;
  newCategory: string;
  userId: string;
};

export interface FormContext {
  promotionRelegationList: Array<PromotionRelegation>;
  add: (value: PromotionRelegation) => void;
  remove: (value: PromotionRelegation) => void;
}

const initalValues: FormContext = {
  promotionRelegationList: [],
  add: () => {},
  remove: () => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const usePromotionRelegationForm = () => useContext(FormContext);

const WithPromotionRelegationForm: FunctionComponent = ({ children }) => {
  const [promotionRelegationList, setPromotionRelegationList] = useState([]);

  const add = useCallback((value: PromotionRelegation) => {
    setPromotionRelegationList([...promotionRelegationList, value]);
  }, []);
  const remove = useCallback((value: PromotionRelegation) => {
    setPromotionRelegationList(
      promotionRelegationList.filter((p) => p.userId === value.userId)
    );
  }, []);

  return (
    <FormContext.Provider
      value={{
        promotionRelegationList,
        add,
        remove,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export { WithPromotionRelegationForm };
