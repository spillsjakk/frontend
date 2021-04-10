import React, { Context, useContext } from "react";

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
