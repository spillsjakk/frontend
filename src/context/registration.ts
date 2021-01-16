import React, { Context, useContext } from "react";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  gender: "M" | "F";
  email: string;
  birthDate: string;
  fideId: string;
  password: string;
}

export interface UserRegistrationContext {
  user: User;
  register: (id: string) => void;
  changeUsername: (value: string) => void;
  changeFirstname: (value: string) => void;
  changeLastname: (value: string) => void;
  changeCountry: (value: string) => void;
  changeRegion: (value: string) => void;
  changeGender: (value: string) => void;
  changeEmail: (value: string) => void;
  changeFideId: (fideId: string) => void;
  changeBirthdate: (fideId: string) => void;
  changePassword: (fideId: string) => void;
}

export const defaultUserRegistrationContext: UserRegistrationContext = {
  user: {
    username: "",
    firstName: "",
    lastName: "",
    country: "NOR",
    region: "",
    gender: "M",
    email: "",
    fideId: "",
    birthDate: "",
    password: "",
  },
  register: (id: string) => {},
  changeUsername: () => {},
  changeFirstname: () => {},
  changeLastname: () => {},
  changeCountry: () => {},
  changeRegion: () => {},
  changeGender: () => {},
  changeEmail: () => {},
  changeFideId: () => {},
  changeBirthdate: () => {},
  changePassword: () => {},
};

const UserRegistrationContext: Context<UserRegistrationContext> = React.createContext(
  defaultUserRegistrationContext
);

export const UserRegistrationProvider = UserRegistrationContext.Provider;
export default UserRegistrationContext;
export const useUserRegistration = () => useContext(UserRegistrationContext);
