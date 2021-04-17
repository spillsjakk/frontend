import { Season } from "../../../hocs/with-league/index";
import React, {
  FunctionComponent,
  useCallback,
  useState,
  Context,
  useContext,
} from "react";

export enum FORM_TYPE {
  CREATE,
  EDIT,
}
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
  fillValues: (value: Season) => void;
  type: FORM_TYPE;
  changeType: (value: FORM_TYPE) => void;
  resetValues: () => void;
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
  startDate: new Date(),
  changeStartDate: (value: Date) => {},
  endDate: new Date(),
  changeEndDate: (value: Date) => {},
  fillValues: (value: Season) => {},
  type: FORM_TYPE.CREATE,
  changeType: (value: FORM_TYPE) => {},
  resetValues: () => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useSeasonForm = () => useContext(FormContext);

const WithSeasonForm: FunctionComponent = ({ children }) => {
  const [type, setType] = useState(FORM_TYPE.CREATE);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
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

  const changeType = useCallback((value: FORM_TYPE) => {
    setType(value);
  }, []);

  const fillValues = useCallback((value: Season) => {
    setId(value.id);
    setName(value.name);
    setDescription(value.description);
    setVisible(value.visible);
    setStartDate(new Date(value.start_date));
    setEndDate(new Date(value.end_date));
  }, []);

  const resetValues = useCallback(() => {
    setId("");
    setName("");
    setDescription("");
    setVisible(true);
    setStartDate(new Date());
    setEndDate(new Date());
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
        fillValues,
        type,
        changeType,
        resetValues,
      }}
    >
      {children}
    </FormProvider>
  );
};

export { WithSeasonForm };
