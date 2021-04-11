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
  startDate: Date;
  changeStartDate: (value: Date) => void;
  endDate: Date;
  changeEndDate: (value: Date) => void;
}

const initalValues: FormContext = {
  id: "",
  changeId: (value: string) => {},
  name: "",
  changeName: (value: string) => {},
  description: "",
  changeDescription: (value: string) => {},
  visible: false,
  changeVisible: (value: boolean) => {},
  startDate: new Date(),
  changeStartDate: (value: Date) => {},
  endDate: new Date(),
  changeEndDate: (value: Date) => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useSeasonForm = () => useContext(FormContext);

const WithSeasonForm: FunctionComponent = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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

  const changeStartDate = useCallback((value: Date) => {
    setStartDate(value);
  }, []);

  const changeEndDate = useCallback((value: Date) => {
    setEndDate(value);
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
        startDate,
        changeStartDate,
        endDate,
        changeEndDate,
      }}
    >
      {children}
    </FormProvider>
  );
};

export { WithSeasonForm };
