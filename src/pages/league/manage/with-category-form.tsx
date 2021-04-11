import React, {
  FunctionComponent,
  useCallback,
  useState,
  Context,
  useContext,
} from "react";

export interface FormContext {
  id: string;
  changeId: (value: string) => void;
  name: string;
  changeName: (value: string) => void;
  description: string;
  changeDescription: (value: string) => void;
  visible: boolean;
  changeVisible: (value: boolean) => void;
  gender_restricted: boolean;
  changeGenderRestricted: (value: boolean) => void;
  f_restricted: boolean;
  changeFRestricted: (value: boolean) => void;
  age_restricted: boolean;
  changeAgeRestricted: (value: boolean) => void;
  minimum_age: number;
  changeMinimumAge: (value: number) => void;
  maximum_age: number;
  changeMaximumAge: (value: number) => void;
  rating_restricted: boolean;
  changeRatingRestricted: (value: boolean) => void;
  minimum_rating: number;
  changeMinimumRating: (value: number) => void;
  maximum_rating: number;
  changeMaximumRating: (value: number) => void;
}

const initalValues: FormContext = {
  id: "",
  changeId: (value: string) => {},
  name: "",
  changeName: (value: string) => {},
  description: "",
  changeDescription: (value: string) => {},
  visible: true,
  changeVisible: (value: boolean) => {},
  gender_restricted: false,
  changeGenderRestricted: (value: boolean) => {},
  f_restricted: false,
  changeFRestricted: (value: boolean) => {},
  age_restricted: false,
  changeAgeRestricted: (value: boolean) => {},
  minimum_age: 0,
  changeMinimumAge: (value: number) => {},
  maximum_age: 0,
  changeMaximumAge: (value: number) => {},
  rating_restricted: false,
  changeRatingRestricted: (value: boolean) => {},
  minimum_rating: 0,
  changeMinimumRating: (value: number) => {},
  maximum_rating: 0,
  changeMaximumRating: (value: number) => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useCategoryForm = () => useContext(FormContext);

const WithCategoryForm: FunctionComponent = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [gender_restricted, setGenderRestricted] = useState(false);
  const [f_restricted, setFRestricted] = useState(false);
  const [age_restricted, setAgeRestricted] = useState(false);
  const [rating_restricted, setRatingRestricted] = useState(false);
  const [minimum_age, setMinimumAge] = useState(0);
  const [maximum_age, setMaximumAge] = useState(0);
  const [minimum_rating, setMinimumRating] = useState(0);
  const [maximum_rating, setMaximumRating] = useState(0);

  const changeId = useCallback((value: string) => {
    setId(value);
  }, []);

  const changeName = useCallback((value: string) => {
    setName(value);
  }, []);

  const changeDescription = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const changeVisible = useCallback((value: boolean) => {
    setVisible(value);
  }, []);

  const changeGenderRestricted = useCallback((value: boolean) => {
    setGenderRestricted(value);
  }, []);

  const changeFRestricted = useCallback((value: boolean) => {
    setFRestricted(value);
  }, []);

  const changeAgeRestricted = useCallback((value: boolean) => {
    setAgeRestricted(value);
  }, []);

  const changeRatingRestricted = useCallback((value: boolean) => {
    setRatingRestricted(value);
  }, []);

  const changeMinimumRating = useCallback((value: number) => {
    setMinimumRating(value);
  }, []);

  const changeMaximumRating = useCallback((value: number) => {
    setMaximumRating(value);
  }, []);

  const changeMinimumAge = useCallback((value: number) => {
    setMinimumAge(value);
  }, []);

  const changeMaximumAge = useCallback((value: number) => {
    setMaximumAge(value);
  }, []);

  return (
    <FormProvider
      value={{
        id,
        changeId,
        name,
        changeName,
        description,
        changeDescription,
        visible,
        changeVisible,
        gender_restricted,
        changeGenderRestricted,
        f_restricted,
        changeFRestricted,
        age_restricted,
        changeAgeRestricted,
        rating_restricted,
        changeRatingRestricted,
        minimum_rating,
        changeMinimumRating,
        maximum_age,
        changeMaximumAge,
        minimum_age,
        changeMinimumAge,
        maximum_rating,
        changeMaximumRating,
      }}
    >
      {children}
    </FormProvider>
  );
};

export { WithCategoryForm };
