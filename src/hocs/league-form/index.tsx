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
  profilePicture: string;
  changeProfilePicture: (value: string) => void;
  bannerPicture: string;
  changeBannerPicture: (value: string) => void;
  organization: string;
  changeOrganization: (value: string) => void;
  club: string;
  changeClub: (value: string) => void;
  visible: boolean;
  changeVisible: (value: boolean) => void;
}

const initalValues: FormContext = {
  id: "",
  changeId: (value: string) => {},
  name: "",
  changeName: (value: string) => {},
  description: "",
  changeDescription: (value: string) => {},
  profilePicture: "",
  changeProfilePicture: (value: string) => {},
  bannerPicture: "",
  changeBannerPicture: (value: string) => {},
  organization: "",
  changeOrganization: (value: string) => {},
  club: "",
  changeClub: (value: string) => {},
  visible: false,
  changeVisible: (value: boolean) => {},
};

const FormContext: Context<FormContext> = React.createContext(initalValues);

export const FormProvider = FormContext.Provider;
export default FormContext;
export const useLeagueForm = () => useContext(FormContext);

const WithLeagueForm: FunctionComponent = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [organization, setOrganization] = useState("");
  const [club, setClub] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bannerPicture, setBannerPicture] = useState<string>("");

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

  const changeOrganization = useCallback((value: string) => {
    setOrganization(value);
  }, []);

  const changeClub = useCallback((value: string) => {
    setClub(value);
  }, []);

  const changeProfilePicture = useCallback((value: string) => {
    setProfilePicture(value);
  }, []);

  const changeBannerPicture = useCallback((value: string) => {
    setBannerPicture(value);
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
        profilePicture,
        changeProfilePicture,
        bannerPicture,
        changeBannerPicture,
        visible,
        changeVisible,
        organization,
        changeOrganization,
        club,
        changeClub,
      }}
    >
      {children}
    </FormProvider>
  );
};
export { WithLeagueForm };
